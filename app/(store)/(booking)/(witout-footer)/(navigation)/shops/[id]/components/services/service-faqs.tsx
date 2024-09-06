import { ServiceFAQ } from "@/types/service";
import React from "react";
import { Translate } from "@/components/translate";

interface ServiceFaqsProps {
  faqs: ServiceFAQ[];
}

export const ServiceFaqs: React.FC<ServiceFaqsProps> = ({ faqs }) => (
  <div className="sm:pt-12 pb-7 sm:px-12 pt-16 px-4">
    <h2 className="text-head font-semibold mb-3">
      <Translate value="faq.questions" />
    </h2>
    {faqs.map((faq) => (
      <div key={faq.id} className="mb-4">
        <h3 className="text-lg font-bold">{faq.translation?.question}</h3>
        <p>{faq.translation?.answer}</p>
      </div>
    ))}
  </div>
);
