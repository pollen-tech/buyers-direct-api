export class EmailAdminOnboardNotifyDto {
    email_type: string = null;
    contactName: string;
    pollenPassId: number;
    companyName: string;
    companyType: string;
    companyLocation: string;
    contactMarketFrom: string;
    contactSubCategories: string;
    contactEmail: string;
    contactPhoneNumber: string;
    contactCategoryOfInterest: string;
    contactTargetResaleMarketCountries: string;
    contactTargetResaleMarketCities: string;
    monthlyOrderVolume: string;
    adminLink: 'https://admin-dev.pollen.tech';
}
