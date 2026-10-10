import { getAllServices } from "@/lib/services";

export default function AdminServicesPage() {
  const services = getAllServices();

  return (
    <article>
      <h1>Services</h1>
      <p className="mt-3">{services.length} published catalogue services. Add another in the service data, then create page records.</p>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr>
              <th className="border-b border-line p-2">Name</th>
              <th className="border-b border-line p-2">Slug</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service.slug}>
                <td className="border-b border-line p-2">{service.name}</td>
                <td className="border-b border-line p-2">{service.slug}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}
