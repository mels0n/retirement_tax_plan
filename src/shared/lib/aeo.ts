// schema-dts not available, using internal types

// Since we cannot install schema-dts without permission, we will define minimal interfaces
// mirroring the schema.org spec to ensure type safety if the package isn't present.
// However, the best practice is to use the package. For now, I'll define the helpers 
// to return broad types but strict internal structure.
// Actually, I will explicitly define the types I need to guarantee robustness as requested.

export type SchemaContext = "https://schema.org";

export interface GeoSchema {
    "@context": SchemaContext;
    "@type": string;
    [key: string]: any;
}

export const generateSoftwareAppSchema = (
    name: string,
    url: string,
    imageUrl: string,
    description: string,
    authorName: string,
    authorUrl: string,
    applicationCategory: string = "FinanceApplication",
    operatingSystem: string = "Web",
    pricing: string = "Free" // "0.00" or generic text
): GeoSchema => {
    return {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name,
        url,
        image: imageUrl,
        description,
        applicationCategory,
        operatingSystem,
        offers: {
            "@type": "Offer",
            price: "0.00",
            priceCurrency: "USD"
        },
        author: {
            "@type": "Person",
            name: authorName,
            url: authorUrl
        },
        creator: {
            "@type": "Person",
            name: authorName
        }
    };
};

export const generateFaqSchema = (
    mainEntity: Array<{ question: string; answer: string }>
): GeoSchema => {
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: mainEntity.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
                "@type": "Answer",
                text: item.answer,
            },
        })),
    };
};

export const generateHowToSchema = (
    name: string,
    description: string,
    steps: Array<{ name: string; text: string; image?: string; url?: string }>
): GeoSchema => {
    return {
        "@context": "https://schema.org",
        "@type": "HowTo",
        name,
        description,
        step: steps.map((step, index) => ({
            "@type": "HowToStep",
            position: index + 1,
            name: step.name,
            text: step.text,
            ...(step.image && { image: step.image }),
            ...(step.url && { url: step.url })
        }))
    };
};
