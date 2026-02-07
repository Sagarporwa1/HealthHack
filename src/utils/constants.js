// App Constants
export const RISK_LEVELS = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
};

export const RISK_LABELS = {
    [RISK_LEVELS.LOW]: 'Low Risk',
    [RISK_LEVELS.MEDIUM]: 'Medium Risk',
    [RISK_LEVELS.HIGH]: 'High Risk',
};

export const RISK_DESCRIPTIONS = {
    [RISK_LEVELS.LOW]: 'No concerning signs detected. Continue regular self-checks.',
    [RISK_LEVELS.MEDIUM]: 'Some signs detected. Monitor closely and consult a healthcare professional.',
    [RISK_LEVELS.HIGH]: 'Concerning signs detected. Please consult a healthcare professional immediately.',
};

export const STORAGE_KEYS = {
    SCANS: '@oral_cancer_app_scans',
    USER_PROFILE: '@oral_cancer_app_user',
    SETTINGS: '@oral_cancer_app_settings',
};

export const EDUCATION_TOPICS = [
    {
        id: '1',
        title: 'What is Oral Cancer?',
        content: 'Oral cancer refers to cancer that develops in any part of the mouth, including lips, tongue, cheeks, floor of the mouth, hard and soft palate, sinuses, and throat.',
        icon: 'book',
    },
    {
        id: '2',
        title: 'Common Symptoms',
        content: 'Look for: persistent mouth sores, lumps or thickening of tissues, white or red patches, difficulty chewing or swallowing, persistent sore throat, or numbness in the mouth.',
        icon: 'alert-circle',
    },
    {
        id: '3',
        title: 'Risk Factors',
        content: 'Major risk factors include tobacco use (smoking/chewing), excessive alcohol consumption, HPV infection, excessive sun exposure to lips, and poor oral hygiene.',
        icon: 'warning',
    },
    {
        id: '4',
        title: 'Prevention Tips',
        content: 'Avoid tobacco and limit alcohol, maintain good oral hygiene, eat a healthy diet rich in fruits and vegetables, protect lips from sun exposure, and get regular dental checkups.',
        icon: 'shield',
    },
    {
        id: '5',
        title: 'Self-Examination Guide',
        content: 'Monthly self-exams: Check lips, gums, tongue (all sides), roof and floor of mouth, inside cheeks, and throat. Look for any changes, sores, or unusual patches.',
        icon: 'check-circle',
    },
];
