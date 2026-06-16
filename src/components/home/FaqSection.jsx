import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { HOME_FAQS } from '../../data/homeData';

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="bg-surface py-16 md:py-24">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="mx-auto flex max-w-xl flex-col items-center text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary-dark">
            FAQ
          </p>
          <h2 className="mt-4 font-heading text-3xl font-bold tracking-tight text-text md:text-4xl">
            Quiet answers to honest questions.
          </h2>

          <div className="mt-10 flex w-full flex-col gap-4 text-left">
            {HOME_FAQS.map(({ question, answer }, index) => {
              const isOpen = openIndex === index;

              return (
                <div key={question} className="w-full">
                  <button
                    type="button"
                    className="flex w-full cursor-pointer items-center justify-between gap-4 rounded-xl border border-border-subtle bg-bg p-4 text-left transition-colors hover:bg-primary-light/30 md:p-5"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    aria-expanded={isOpen}
                  >
                    <span className="font-heading text-sm font-semibold text-text md:text-base">
                      {question}
                    </span>
                    <ChevronDown
                      size={18}
                      className={`shrink-0 text-text transition-transform duration-500 ease-in-out ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <p
                    className={`overflow-hidden px-4 text-sm leading-relaxed text-text-secondary transition-all duration-500 ease-in-out md:text-base ${
                      isOpen
                        ? 'max-h-64 translate-y-0 pt-4 opacity-100'
                        : 'max-h-0 -translate-y-2 opacity-0'
                    }`}
                  >
                    {answer}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
