# Andhra Pradesh revenue villages — source report

Generated 2026-11-10. Output: `villages.csv` (header `district,mandal,name,kind,source`), **17,957 rows**, covering **all 28 districts and all 686 mandals** in `../districts.json`.

## Primary source — Local Government Directory (LGD), Ministry of Panchayati Raj

| What | URL | Accessed |
|---|---|---|
| District list, AP (state code 28) | https://lgdirectory.gov.in/webservices/lgdws/districtList?stateCode=28 | 2026-11-10 |
| Sub-district (mandal) list per district | https://lgdirectory.gov.in/webservices/lgdws/subdistrictList?districtCode=<LGD district code> | 2026-11-10 |
| Revenue villages per mandal | https://lgdirectory.gov.in/webservices/lgdws/villageList?subDistrictCode=<LGD sub-district code> | 2026-11-10 |

- These are LGD's public web-service endpoints. They respond to an HTTP **POST** to the URL shown, with no login or captcha. Each CSV row's `source` is the exact `villageList` URL for that row's mandal.
- LGD already reflects the 31 Dec 2025 reorganisation: it returns 28 AP districts, including Markapuram (LGD code 790) and Polavaram (791). Its mandal counts per district match `districts.json`, apart from Nandyal and Vizianagaram, where LGD splits one mandal into Rural and Urban (see below).
- Village names are copied exactly from LGD's `villageNameEnglish`. The only changes: names that were entirely upper or lower case were Title-Cased, and extra whitespace was collapsed. No names were added, guessed or merged.
- `kind` is `village` on every row.
- The service rate-limits (HTTP 429) when sent parallel requests, so the data was fetched sequentially.

## Mandal matching (LGD sub-district to `districts.json` mandal)

- Each LGD district maps one-to-one by name to a `districts.json` district slug.
- Within each district, 625 LGD sub-districts matched a mandal name directly, after normalising case, punctuation and common transliteration variants (aa/a, ee/i, th/t, doubled letters).
- The 61 sub-districts below were matched using an explicit, reviewed alias table. All of them are spelling variants or expanded forms of an abbreviation, in the same district.
- **Rows skipped because the mandal could not be matched: 0.** No `districts.json` mandal is left without villages.

| District | LGD sub-district name | LGD code | Mapped to mandal |
|---|---|---|---|
| alluri-sitharama-raju | Gudem Kotha Veedhi | 4850 | G.K.Veedhi |
| alluri-sitharama-raju | Munchingi Puttu | 4841 | Munchingput |
| anakapalli | Butchayyapeta | 4873 | Butchiahpeta |
| ananthapuramu | Bukkaraya Samudram | 5329 | BK Samudram |
| ananthapuramu | Kalyanadurg | 5321 | Kalyandurg |
| ananthapuramu | Tadipatri | 5313 | Tadpatri |
| annamayya | Beerongi Kothakota | 5391 | B.Kothakota |
| annamayya | Kambhamvaripalle | 5372 | Kambhavaripalle |
| annamayya | Sambepalle | 5237 | Sambepalli |
| bapatla | Amarthalur | 5086 | Amruthalur |
| bapatla | Cherukupalli | 5090 | Cherukupalle |
| konaseema | Sakhinetipalli | 4939 | Sakhinetipalle |
| east-godavari | Biccavolu | 4916 | Biccavole |
| east-godavari | Rajamahendravaram Rural | 4907 | Rajahmundry Rural |
| east-godavari | Rajamahendravaram Urban | 4906 | Rajahmundry Urban |
| east-godavari | Seethanagaram | 4896 | Seethanagram |
| eluru | Buttayagudem | 4948 | Buttaigudem |
| guntur | Tadepalli | 5054 | Tadepalle |
| kakinada | Kakinada (Rural) | 4913 | Kakinada Rural |
| kakinada | Kakinada (Urban) | 4914 | Kakinada Urban |
| kurnool | Adoni | 5271 | Adoni-1 |
| kurnool | Holagunda | 5272 | Holagonda |
| kurnool | Kurnool Rural | 5259 | Kurnool |
| nandyal | Koilakuntla | 5296 | Koilkuntla |
| nandyal | Kothapalle | 5263 | Kothapalli |
| nandyal | Nandyal Rural | 5284 | Nandyal |
| nandyal | Nandyal Urban | 7425 | Nandyal |
| nandyal | Velugodu | 5282 | Velgodu |
| ntr | Atlapragada Konduru | 4998 | A Konduru |
| ntr | Gaddamanugu Konduru | 5006 | G Konduru |
| ntr | Vijayawada (Rural) | 5011 | Vijayawada Rural |
| palnadu | Chilakaluripet H/O.Purushotha Patnam | 5070 | Chilakaluripet |
| palnadu | Gurajala | 5044 | Gurazala |
| palnadu | Rompicharla | 5066 | Rompicherla |
| palnadu | Savalyapuram H/O Kanamarlapudi | 5064 | Savalyapuram |
| parvathipuram-manyam | Jiyyammavalasa | 4810 | Jiyammavalasa |
| prakasam | J.Pangulur | 5111 | Janakavarampanguluru |
| srikakulam | Ganguvarisigadam | 4797 | G.Sigadam |
| srikakulam | Ichchapuram | 4778 | Ichapuram |
| srikakulam | Laxminarasupeta | 4787 | L.N.Peta |
| sri-sathya-sai | Bathalapalli | 5337 | Bathalapalle |
| sri-sathya-sai | Chilamathur | 5366 | Chilamuthur |
| sri-sathya-sai | Kanaganipalli | 5335 | Kanagapalli |
| sri-sathya-sai | Nallachervu | 5359 | Nallacheruvu |
| sri-sathya-sai | Obuladevaracheruvu | 5358 | Oubuladevaracheruvu |
| tirupati | Pichatur | 5401 | Pitchatur |
| tirupati | Tirupati (Rural) | 5375 | Tirupati Rural |
| tirupati | Tirupati (Urban) | 5383 | Tirupati Urban |
| visakhapatnam | Gopalapatnam | 6838 | Gopalpatnam |
| vizianagaram | Vizianagaram Rural | 4836 | Vizianagaram |
| vizianagaram | Vizianagaram Urban | 7431 | Vizianagaram |
| west-godavari | Palacoderu | 4977 | Palacoduru |
| ysr-kadapa | Brahmamgarimattam | 5205 | B. Mattam |
| ysr-kadapa | Chinthakommadinne | 5231 | C.K. Dinne |
| ysr-kadapa | Peddamudiam | 5201 | Peddamudium |
| ysr-kadapa | Proddutur | 5214 | Proddatur |
| ysr-kadapa | S.Mydukur | 5204 | Mydukur |
| ysr-kadapa | Sri Avadhutha Kasinayana | 5206 | SAKN |
| ysr-kadapa | T.Sundupalle | 5238 | Tsundupalli |
| ysr-kadapa | Veeraballe | 5242 | Veeraballi |

Notes on the less obvious mappings:
- **Kurnool:** LGD "Adoni" (Census 2011 code 05271, the original mandal) maps to "Adoni-1"; LGD lists "Adoni-2" separately. LGD "Kurnool Rural" maps to "Kurnool", because `districts.json` has "Kurnool" and "Kurnool Urban", and LGD's "Kurnool Urban" matches the latter directly.
- **Nandyal and Vizianagaram:** LGD splits each into Rural and Urban sub-districts, while `districts.json` has a single mandal. Villages from both LGD units are assigned to that single mandal ("Nandyal" or "Vizianagaram").

## Per-district counts

| District (slug) | Mandals with villages | Villages | Of which urban/part-type LGD units* | District-site cross-check |
|---|---|---|---|---|
| Alluri Sitharama Raju (alluri-sitharama-raju) | 11/11 | 2477 | 4 | no site list |
| Anakapalli (anakapalli) | 24/24 | 740 | 7 | no site list |
| Ananthapuramu (ananthapuramu) | 32/32 | 506 | 8 | no site list |
| Annamayya (annamayya) | 25/25 | 362 | 11 | no site list |
| Bapatla (bapatla) | 20/20 | 211 | 5 | no site list |
| Chittoor (chittoor) | 28/28 | 767 | 8 | no site list |
| Dr. B. R. Ambedkar Konaseema (konaseema) | 19/19 | 283 | 1 | 257/283 (90.8%) |
| East Godavari (east-godavari) | 22/22 | 323 | 8 | 298/323 (92.3%) |
| Eluru (eluru) | 28/28 | 668 | 8 | no site list |
| Guntur (guntur) | 18/18 | 224 | 13 | 188/224 (83.9%) |
| Kakinada (kakinada) | 21/21 | 436 | 9 | 402/436 (92.2%) |
| Krishna (krishna) | 26/26 | 507 | 8 | 473/507 (93.3%) |
| Kurnool (kurnool) | 27/27 | 472 | 11 | 448/472 (94.9%) |
| Markapuram (markapuram) | 21/21 | 510 | 5 | no site list |
| Nandyal (nandyal) | 29/29 | 457 | 8 | no site list |
| NTR (ntr) | 20/20 | 327 | 20 | 303/327 (92.7%) |
| Palnadu (palnadu) | 28/28 | 364 | 4 | 310/364 (85.2%) |
| Parvathipuram Manyam (parvathipuram-manyam) | 15/15 | 967 | 1 | 943/967 (97.5%) |
| Polavaram (polavaram) | 12/12 | 834 | 1 | no site list |
| Prakasam (prakasam) | 28/28 | 520 | 6 | no site list |
| Sri Potti Sriramulu Nellore (nellore) | 36/36 | 718 | 15 | no site list |
| Sri Sathya Sai (sri-sathya-sai) | 32/32 | 461 | 2 | no site list |
| Srikakulam (srikakulam) | 30/30 | 1472 | 13 | 667/1472 (45.3%) |
| Tirupati (tirupati) | 36/36 | 1082 | 21 | no site list |
| Visakhapatnam (visakhapatnam) | 11/11 | 165 | 8 | no site list |
| Vizianagaram (vizianagaram) | 27/27 | 983 | 11 | 942/983 (95.8%) |
| West Godavari (west-godavari) | 20/20 | 319 | 7 | 235/319 (73.7%) |
| YSR Kadapa (ysr-kadapa) | 40/40 | 802 | 18 | 498/802 (62.1%) |
| **Total** | **686/707** | **17957** | **241** | |

\* An "urban/part-type LGD unit" is a name containing (Ct) census town, (U), (Og) outgrowth, (M), "Urban", "Part", "Municipal", "Corporation" or "Constituency". For example: "Guntur Part (East Constituency)", "Mangalagiri Urban", "Mamidalapadu (Ct)". These are official LGD village entries that lie inside or next to towns. They are kept, but you may want to filter them out of village-page generation.

## Cross-check sources (official district websites, NIC S3WaaS), accessed 2026-11-10

These were used only to validate LGD names, not as row sources. The cross-check column above shows how many LGD village names in each district also appear on that district's official list. The comparison uses normalised names and ignores mandal.

| District | URL | Notes |
|---|---|---|
| Konaseema | https://konaseema.ap.gov.in/villages/ and https://konaseema.ap.gov.in/about-district/administrative-setup/village-panchayats/ | Division / Mandal / Village tables. The pre-2025 layout includes Tallarevu and Rayavaram. |
| Kurnool | https://kurnool.ap.gov.in/villages/ | Division / Mandal / Village tables. |
| Krishna | https://krishna.ap.gov.in/new_villages/ | Current Krishna mandals. Some names are truncated on the page (e.g. "CHIRUVOLLANKA (SOUT"). The older https://krishna.ap.gov.in/villages/ covers undivided Krishna. |
| NTR | https://ntr.ap.gov.in/mandal-wise-villages/ | Mandal / Village. |
| Guntur | https://guntur.ap.gov.in/villages/ | Division / Mandal / Village. |
| Palnadu | https://palnadu.ap.gov.in/village-panchayats/ | Division / Mandal / Village. |
| East Godavari | https://eastgodavari.ap.gov.in/about-district/administrative-setup/villages/ | Division / Mandal / Village. |
| Kakinada | https://kakinada.ap.gov.in/about-district/administrative-setup/village-panchayats/ | Division / Mandal / Village. |
| West Godavari | https://westgodavari.ap.gov.in/village-panchayats/ | Partial list (262 rows). |
| YSR Kadapa | https://kadapa.ap.gov.in/villages/ | Pre-2022 undivided district list; it includes mandals now in Annamayya and Tirupati, so the overlap figure is low. |
| Vizianagaram | https://cdn.s3waas.gov.in/s3cee631121c2ec9232f3a2f028ad5c89b/uploads/2022/07/2022070696.pdf | LGD extract dated July 2022, linked as "LG Directory" on vizianagaram.ap.gov.in. |
| Parvathipuram Manyam | https://cdn.s3waas.gov.in/s31679091c5a880faf6fb5e6087eb1b2dc/uploads/2022/07/2022070648.pdf | LGD extract dated 05-07-2022, linked as "LG Directory" on parvathipurammanyam.ap.gov.in. |
| Srikakulam | https://cdn.s3waas.gov.in/s3f899139df5e1059396431415e770c6dd/uploads/2019/07/2019072644-1.pdf | 2019 list of 1,865 villages for the pre-2022 district (it includes the Palakonda division). Only about 918 names were parsed from the PDF, so this check is partial. |

Most non-matches were spelling variants, e.g. "Etukur" vs "ETUKURU" and "Pothur" vs "POTHURU".

District pages that were **not usable** as village sources:
- Placeholder pages or no table: Alluri Sitharama Raju, Anakapalli, Annamayya (`/revenue-villages/` says "will be populated"), Chittoor, Eluru (lorem-ipsum placeholder), Markapuram, Visakhapatnam.
- Counts only: Bapatla, Srikakulam (HTML page), Vizianagaram (HTML page), Parvathipuram Manyam.
- Mandal officers only: Polavaram.
- **Gram panchayat lists, which are not revenue villages:** Ananthapuramu `/gram-panchayats/`, Nandyal, Prakasam, SPS Nellore `/grama-panchayats/`, Tirupati, and Sri Sathya Sai ("Village & Gram Panchayat").

Other candidates checked:
- LGD bulk download (https://lgdirectory.gov.in/downloadDirectory.do) needs a captcha, so it was not used; the web-service endpoints above were used instead.
- https://apopendata.ap.gov.in does not resolve (DNS failure).
- Census 2011 and data.gov.in were not needed, because LGD gave full current coverage.

## Caveats

1. **LGD snapshot.** The data reflects LGD as served on 2026-11-10. LGD is maintained by the state and is the authoritative registry, but individual village-to-mandal changes made after the Dec 2025 notifications may not yet be recorded.
2. **Same name in the same mandal.** 132 (district, mandal, name) combinations occur more than once. These are distinct LGD villages with different LGD codes that share a name (common in agency areas, e.g. Alluri Sitharama Raju). They were kept. The CSV has no code column, so they look like duplicates; the LGD codes can be recovered from the `source` URL response.
3. **Urban and part-type units.** 241 rows are urban, census-town, outgrowth or "Part" units (see the footnote under the counts table). They are official LGD entries but are not classic rural revenue villages.
4. **Spelling.** Spellings follow LGD and can differ from district websites, Meebhoomi and Census 2011 (e.g. "Etukur" vs "Etukuru"). Some LGD names include qualifiers such as "(R)", "(East)", "@ Alias" or "(Near X)"; these were kept as written.
5. **Merged mandals.** For Nandyal and Vizianagaram, LGD's Rural and Urban sub-districts were merged into the single `districts.json` mandal.
6. **Agency areas.** Alluri Sitharama Raju (2,477 villages), Polavaram (834) and Parvathipuram Manyam (967) have very high village counts. This is expected: tribal agency areas have many small revenue villages, and some may be uninhabited ("bechirak").
