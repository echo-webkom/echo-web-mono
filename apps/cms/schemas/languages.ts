interface Language {
    id: string;
    title: string;
    isDefault: boolean;
}

const languages: Array<Language> = [
    {
        id: 'no',
        title: 'Norsk',
        isDefault: true,
    },
    {
        id: 'en',
        title: 'English',
        isDefault: false,
    },
];

export default languages;
