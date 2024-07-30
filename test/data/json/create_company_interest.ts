export const create_company_req_data = {
  company_id: "",
  order_volume_id: 1,
  order_volume_name: "20 packets of Month",
  interest_categories: [
    {
      category_id: 1,
      category_name: "Hair Care",
    },
    {
      category_id: 2,
      category_name: "Skin Care",
    },
  ],
  import_markets: [
    {
      country_id: 1,
      country_name: "Singapore",
    },
  ],
  target_markets: [
    {
      country_id: 1,
      country_name: "Singapore",
      cities: [
        {
          city_id: 1,
          city_name: "Orchard",
        },
      ],
    },
  ],
};
