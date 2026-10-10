import {
  services,
  type Service,
  type ServiceFaq,
  type ServiceImage,
} from "@/data/services";

export type ServiceFaqItem = ServiceFaq & {
  id: string;
};

export type ServiceSEO = {
  title: string;
  description: string;
  path: string;
  indexable: boolean;
  image: ServiceImage;
};

const servicesBySlug = new Map(services.map((service) => [service.slug, service]));
const activeServices = services.filter((service) => service.active);

export function getAllServices(): Service[] {
  return activeServices;
}

export type { Service };

export function getServiceBySlug(slug: string): Service | undefined {
  return servicesBySlug.get(slug);
}

export function getRelatedServices(slug: string): Service[] {
  const service = getServiceBySlug(slug);

  if (!service) {
    return [];
  }

  return service.relatedServices
    .map((relatedSlug) => getServiceBySlug(relatedSlug))
    .filter((related): related is Service => Boolean(related?.active));
}

export function getServiceFAQs(slug: string): ServiceFaqItem[] {
  const service = getServiceBySlug(slug);

  if (!service) {
    return [];
  }

  return service.faqs.map((faq, index) => ({
    id: `${service.slug}-faq-${index + 1}`,
    question: faq.question,
    answer: faq.answer,
  }));
}

export function getServiceSEO(slug: string): ServiceSEO | undefined {
  const service = getServiceBySlug(slug);

  if (!service?.active) {
    return undefined;
  }

  return {
    title: service.seoTitle,
    description: service.seoDescription,
    path: `/services/${service.slug}`,
    indexable: service.indexable,
    image: service.heroImage,
  };
}
