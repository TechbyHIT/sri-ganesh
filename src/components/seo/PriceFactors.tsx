import Link from "next/link";
import { PRICING_STATEMENT } from "@/config/seo";

const factors = [
  ["Measured size", "Width, height, and corners that are not square."],
  ["Material grade", "Wire, mesh, spikes, or rods named on the quote."],
  ["Spacing", "Tighter where children or pets use the opening."],
  ["Installation complexity", "Columns, pipes, doors, and corners."],
  ["Building height", "How the installer reaches the opening."],
  ["Site access", "Stairs, occupied rooms, and working hours."],
  ["Quantity", "One balcony is not the same job as a full block."],
] as const;

export function PriceFactors() {
  return (
    <section className="mt-10" aria-labelledby="price-factors-title">
      <h2 id="price-factors-title">Price factors</h2>
      <p className="mt-3 max-w-3xl">{PRICING_STATEMENT}</p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
          <caption className="sr-only">Factors recorded before a home safety quote</caption>
          <thead>
            <tr className="border-b border-line">
              <th className="py-3 pr-4 font-extrabold" scope="col">
                Factor
              </th>
              <th className="py-3 font-extrabold" scope="col">
                What is checked
              </th>
            </tr>
          </thead>
          <tbody>
            {factors.map(([factor, detail]) => (
              <tr key={factor} className="border-b border-line">
                <th className="py-3 pr-4 font-bold" scope="row">
                  {factor}
                </th>
                <td className="py-3 text-muted">{detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3">
        <Link className="font-bold text-teal no-underline" href="/pricing-guide">
          How a quote is built
        </Link>
      </p>
    </section>
  );
}
