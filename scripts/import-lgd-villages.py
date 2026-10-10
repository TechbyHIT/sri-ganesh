import json
import os
import re
import sys
from pathlib import Path

from pypdf import PdfReader

ROOT = Path(r"X:\sri ganesha home safety solutions")
DOWNLOAD = Path(os.environ.get("LGD_DOWNLOAD_DIR", r"c:\Users\karesuvartharaju\Downloads\downloadDir2026_10_09_18_18_40_271"))
SOURCE = "https://lgdirectory.gov.in/"
VERIFIED = "2026-10-09"

DISTRICT_KEYS = {
    "745": "alluri-sitharama-raju",
    "744": "anakapalli",
    "502": "ananthapuramu",
    "753": "annamayya",
    "750": "bapatla",
    "503": "chittoor",
    "747": "konaseema",
    "505": "east-godavari",
    "748": "eluru",
    "506": "guntur",
    "746": "kakinada",
    "510": "krishna",
    "511": "kurnool",
    "755": "nandyal",
    "749": "ntr",
    "751": "palnadu",
    "743": "parvathipuram-manyam",
    "517": "prakasam",
    "519": "srikakulam",
    "515": "sps-nellore",
    "754": "sri-sathya-sai",
    "752": "tirupati",
    "520": "visakhapatnam",
    "521": "vizianagaram",
    "523": "west-godavari",
    "504": "ysr-kadapa",
}
SKIP_DISTRICTS = {"790", "791"}


def slugify(value: str) -> str:
    value = value.lower().replace("&", " and ")
    value = re.sub(r"[^a-z0-9]+", "-", value)
    return value.strip("-")


def norm(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "", value.lower())


def levenshtein(left: str, right: str) -> int:
    if abs(len(left) - len(right)) > 3:
        return 99
    row = list(range(len(right) + 1))
    for i, left_char in enumerate(left, start=1):
        previous = row[0]
        row[0] = i
        for j, right_char in enumerate(right, start=1):
            current = row[j]
            row[j] = previous if left_char == right_char else min(previous, row[j], row[j - 1]) + 1
            previous = current
    return row[-1]


def field(text: str) -> str:
    parts = re.split(r"\s{2,}", text.strip())
    return parts[0].strip() if parts else ""


def is_header(line: str) -> bool:
    return bool(
        re.search(
            r"Local Government|Directory|S\.\s*No|Sub-?district Name|Village Name|In English|In Local|Census|State code|All Villages|All Subdistricts|Oct \d",
            line,
            re.I,
        )
    )


def pages(path: Path):
    reader = PdfReader(str(path))
    for page in reader.pages:
        yield page.extract_text(extraction_mode="layout") or ""


def columns(line: str) -> list[str]:
    return [part.strip() for part in re.split(r"\s{2,}", line.strip()) if part.strip()]


def is_village_row(parts: list[str]) -> bool:
    return (
        len(parts) >= 8
        and parts[0].isdigit()
        and re.fullmatch(r"\d{3}", parts[1]) is not None
        and re.fullmatch(r"\d{4}", parts[3]) is not None
        and re.fullmatch(r"\d{6}", parts[5]) is not None
    )


def is_subdistrict_row(parts: list[str]) -> bool:
    return (
        len(parts) >= 6
        and parts[0].isdigit()
        and re.fullmatch(r"\d{3}", parts[1]) is not None
        and re.fullmatch(r"\d{4}", parts[3]) is not None
        and not parts[5].isdigit()
    )


def parse_villages():
    rows = []
    current = None
    for text in pages(DOWNLOAD / "villageofSpecificState2026_10_09_18_18_43_815.pdf"):
        for raw in text.splitlines():
            if is_header(raw):
                continue
            parts = columns(raw)
            if not parts:
                continue
            if is_village_row(parts):
                if current:
                    rows.append(current)
                current = {
                    "district_code": parts[1],
                    "sub_code": parts[3],
                    "sub_name": parts[4],
                    "village_code": parts[5],
                    "village_name": parts[7],
                }
            elif current and len(parts) >= 2 and parts[-1].lower() not in {"inhabitant", "uninhabited"}:
                current["village_name"] = f"{current['village_name']} {parts[-1]}".strip()
    if current:
        rows.append(current)
    return rows


def parse_subdistricts():
    rows = []
    for text in pages(DOWNLOAD / "subDistrictofSpecificState2026_10_09_18_18_40_504.pdf"):
        for raw in text.splitlines():
            if is_header(raw):
                continue
            parts = columns(raw)
            if not is_subdistrict_row(parts):
                continue
            rows.append({"district_code": parts[1], "sub_code": parts[3], "name": parts[5]})
    return rows


def load_existing_mandals():
    mandals = []
    official = (ROOT / "src/data/locations/official-mandals.ts").read_text(encoding="utf-8")
    for match in re.finditer(
        r'districtId:\s*"(district-[^"]+)",\s*name:\s*"([^"]+)",\s*slug:\s*"([^"]+)"',
        official,
    ):
        district_id, name, slug = match.groups()
        key = district_id.removeprefix("district-")
        mandals.append({"id": f"mandal-{key}-{slug}", "districtId": district_id, "name": name, "slug": slug})
    remaining = (ROOT / "src/data/locations/remaining-areas.ts").read_text(encoding="utf-8")
    for match in re.finditer(
        r'id:\s*"([^"]+)",\s*divisionId:\s*(?:null|"[^"]+"),\s*districtId:\s*"(district-[^"]+)",\s*name:\s*"([^"]+)",\s*slug:\s*"([^"]+)"',
        remaining,
    ):
        mandals.append(
            {"id": match.group(1), "districtId": match.group(2), "name": match.group(3), "slug": match.group(4)}
        )
    tirupati = (ROOT / "src/data/locations/mandals.ts").read_text(encoding="utf-8")
    for match in re.finditer(r'name:\s*"([^"]+)",\s*slug:\s*"([^"]+)"', tirupati):
        name, slug = match.groups()
        mandals.append({"id": f"mandal-{slug}", "districtId": "district-tirupati", "name": name, "slug": slug})
    return mandals


def load_slugs():
    slugs = set()
    ids = set()
    for path in (ROOT / "src/data/locations").rglob("*.ts"):
        if path.name in {"villages.ts", "lgd-mandals.ts"}:
            continue
        text = path.read_text(encoding="utf-8")
        slugs.update(re.findall(r'\bslug:\s*"([^"]+)"', text))
        ids.update(re.findall(r'\bid:\s*"([^"]+)"', text))
        for block in re.findall(r"aliases:\s*\[([^\]]*)\]", text):
            for alias in re.findall(r'"([^"]+)"', block):
                alias_slug = slugify(alias)
                if alias_slug:
                    slugs.add(alias_slug)
        for block in re.findall(r"district\((?:[^)]|\n)*?\[([^\]]+)\]", text):
            for alias in re.findall(r'"([^"]+)"', block):
                alias_slug = slugify(alias)
                if alias_slug:
                    slugs.add(alias_slug)
    towns = (ROOT / "src/data/locations/towns.ts").read_text(encoding="utf-8")
    overrides = dict(re.findall(r"^\s+([^:\n]+):\s*\"([^\"]+)\"", towns, re.M))
    for name in re.findall(r'"([^"]+)"', towns):
        if name.startswith("district-") or name.startswith("user-") or " " not in name and name.startswith("andhra"):
            continue
        slug = overrides.get(name) or slugify(name)
        if slug:
            slugs.add(slug)
            ids.add(f"town-{slug}")
    for key in DISTRICT_KEYS.values():
        slug = f"{key}-district" if key in {"guntur", "kakinada", "tirupati", "visakhapatnam"} else key
        slugs.add(slug)
        ids.add(f"district-{key}")
    ids.add("state-andhra-pradesh")
    return slugs, ids


def unique_slug(slugs: set[str], base: str, suffixes: list[str]) -> str:
    if base and base not in slugs:
        slugs.add(base)
        return base
    for suffix in suffixes:
        candidate = f"{base}-{suffix}" if base else suffix
        if candidate not in slugs:
            slugs.add(candidate)
            return candidate
    number = 2
    while f"{base}-{number}" in slugs:
        number += 1
    candidate = f"{base}-{number}"
    slugs.add(candidate)
    return candidate


def find_mandal(existing: list[dict], district_id: str, name: str):
    key = norm(name)
    pool = [item for item in existing if item["districtId"] == district_id]
    exact = [item for item in pool if norm(item["name"]) == key]
    if len(exact) == 1:
        return exact[0]
    if len(key) < 8:
        return None
    close = [item for item in pool if levenshtein(norm(item["name"]), key) <= 2]
    return close[0] if len(close) == 1 else None


def main():
    print("parsing subdistricts")
    subdistricts = parse_subdistricts()
    print("parsing villages")
    villages = parse_villages()
    print("subdistricts", len(subdistricts), "villages", len(villages))
    print("sample sub", subdistricts[:5])
    print("sample village", villages[:5])
    wrapped = next((row for row in villages if "Cheedivalasa" in row["village_name"]), None)
    print("wrapped", wrapped)
    bad_names = [
        row
        for row in villages
        if not re.fullmatch(r"\d{6}", row["village_code"])
        or re.search(r"Village Name|Subdistrict Name|In English|In Local", row["village_name"], re.I)
    ]
    bad_subs = [
        row
        for row in subdistricts
        if re.search(r"Subdistrict Name|In English|In Local", row["name"], re.I)
    ]
    if not wrapped or bad_names or bad_subs or len(villages) < 15000 or len(subdistricts) < 600:
        raise SystemExit(
            f"refusing to write: villages={len(villages)} subdistricts={len(subdistricts)} "
            f"bad_villages={len(bad_names)} bad_subs={len(bad_subs)} wrapped={wrapped}"
        )

    existing = load_existing_mandals()
    slugs, ids = load_slugs()
    for item in existing:
        slugs.add(item["slug"])
        ids.add(item["id"])

    new_mandals = []
    mandal_by_code = {}
    skipped_districts = {}
    unknown_codes = {}

    for row in subdistricts:
        code = row["district_code"]
        if code in SKIP_DISTRICTS:
            skipped_districts[code] = skipped_districts.get(code, 0) + 1
            continue
        key = DISTRICT_KEYS.get(code)
        if not key or not row["sub_code"].isdigit() or not row["name"]:
            unknown_codes[code] = unknown_codes.get(code, 0) + 1
            continue
        district_id = f"district-{key}"
        found = find_mandal(existing, district_id, row["name"])
        if found:
            mandal_by_code[(code, row["sub_code"])] = found
            continue
        base = slugify(row["name"])
        slug = unique_slug(slugs, base, [key, f"lgd-{row['sub_code']}"])
        mandal_id = f"mandal-{key}-lgd-{row['sub_code']}"
        if mandal_id in ids:
            mandal_id = unique_slug(ids, mandal_id, [row["sub_code"]])
        else:
            ids.add(mandal_id)
        record = {
            "id": mandal_id,
            "name": row["name"],
            "slug": slug,
            "districtId": district_id,
            "subCode": row["sub_code"],
        }
        new_mandals.append(record)
        existing.append(record)
        mandal_by_code[(code, row["sub_code"])] = record

    village_rows = []
    skipped_villages = {}
    unmatched = 0
    seen_codes = set()
    for row in villages:
        code = row["district_code"]
        if code in SKIP_DISTRICTS:
            skipped_villages[code] = skipped_villages.get(code, 0) + 1
            continue
        key = DISTRICT_KEYS.get(code)
        name = re.sub(r"\s+", " ", row["village_name"]).strip(" -")
        if not key or not name or not row["village_code"].isdigit():
            unmatched += 1
            continue
        if row["village_code"] in seen_codes:
            continue
        seen_codes.add(row["village_code"])
        mandal = mandal_by_code.get((code, row["sub_code"]))
        if not mandal:
            mandal = find_mandal(existing, f"district-{key}", row["sub_name"])
        if not mandal:
            unmatched += 1
            continue
        base = slugify(name)
        slug = unique_slug(slugs, base, [row["village_code"], f"{mandal['slug']}-{row['village_code']}"])
        village_rows.append(
            {
                "id": f"village-lgd-{row['village_code']}",
                "districtId": f"district-{key}",
                "mandalId": mandal["id"],
                "name": name,
                "slug": slug,
            }
        )

    print(
        json.dumps(
            {
                "newMandals": len(new_mandals),
                "villages": len(village_rows),
                "unmatchedVillages": unmatched,
                "skippedSubdistricts": skipped_districts,
                "skippedVillages": skipped_villages,
                "unknownSubdistrictCodes": unknown_codes,
            },
            indent=2,
        )
    )

    if "--dry-run" in sys.argv:
        print("dry run: validated the download. No files were written.")
        return

    mandal_lines = [
        'import type { AdminLocation } from "@/data/types";',
        "",
        f'const sourceUrl = "{SOURCE}";',
        f'const verifiedAt = "{VERIFIED}";',
        "",
        "/** Subdistricts from the Local Government Directory download of 9 October 2026 that were not already imported. Markapuram and Polavaram are excluded. */",
        "export const lgdMandals: AdminLocation[] = [",
    ]
    for item in new_mandals:
        mandal_lines.append(
            "  { id: %s, name: %s, slug: %s, type: \"mandal\", parentId: %s, districtId: %s, mandalId: %s, aliases: [], languageNames: {}, sourceUrl, verifiedAt, active: true, serviceAvailable: false, indexable: false, contentQualityStatus: \"administrative-record\" },"
            % (
                json.dumps(item["id"]),
                json.dumps(item["name"]),
                json.dumps(item["slug"]),
                json.dumps(item["districtId"]),
                json.dumps(item["districtId"]),
                json.dumps(item["id"]),
            )
        )
    mandal_lines.append("];")
    mandal_lines.append("")
    (ROOT / "src/data/locations/lgd-mandals.ts").write_text("\n".join(mandal_lines), encoding="utf-8")

    village_lines = [
        'import type { AdminLocation } from "@/data/types";',
        "",
        f'const sourceUrl = "{SOURCE}";',
        f'const verifiedAt = "{VERIFIED}";',
        "",
        "function village(input: { id: string; districtId: string; mandalId: string; name: string; slug: string }): AdminLocation {",
        "  return {",
        "    id: input.id,",
        "    name: input.name,",
        "    slug: input.slug,",
        "    type: \"village\",",
        "    parentId: input.mandalId,",
        "    districtId: input.districtId,",
        "    mandalId: input.mandalId,",
        "    aliases: [],",
        "    languageNames: {},",
        "    sourceUrl,",
        "    verifiedAt,",
        "    active: true,",
        "    serviceAvailable: false,",
        "    indexable: false,",
        '    contentQualityStatus: "administrative-record",',
        "  };",
        "}",
        "",
        "/** Villages from the Local Government Directory download of 9 October 2026. Markapuram and Polavaram rows were not imported. */",
        "export const villages: AdminLocation[] = [",
    ]
    for item in village_rows:
        village_lines.append(
            "  village({ id: %s, districtId: %s, mandalId: %s, name: %s, slug: %s }),"
            % (
                json.dumps(item["id"]),
                json.dumps(item["districtId"]),
                json.dumps(item["mandalId"]),
                json.dumps(item["name"]),
                json.dumps(item["slug"]),
            )
        )
    village_lines.append("];")
    village_lines.append("")
    (ROOT / "src/data/locations/villages.ts").write_text("\n".join(village_lines), encoding="utf-8")
    print("wrote files")


if __name__ == "__main__":
    main()
