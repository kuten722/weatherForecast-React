import { useState } from "react";
import { AsyncPaginate } from "react-select-async-paginate";
import { geoRequest } from "../../netWorkConfig";

const Search = ({ onSearchChange }) => {
    const [search, setSearch] = useState(null);

      const loadOptions = async (inputValue) => {
        try {
          const response = await geoRequest.get('', {
            params: {
              minPopulation: 1000000,
              namePrefix: inputValue
            }
          });
          // 假设这是在 loadOptions 函数内部
          return {
            options: response.data.data.map((city) => {
              return {
                value: `${city.latitude} ${city.longitude}`,
                label: `${city.name}, ${city.countryCode}`
              };
            })
          };
        } catch (error) {
          console.error("geoInfo:", error);
          return { options: [] };
        }
      }

    const handleOnChange = (searchData) => {
        setSearch(searchData);
        onSearchChange(searchData);
    }
    return (
        <AsyncPaginate
            placeholder="Search for city"
            debounceTimeout={600}
            value={search}
            onChange={handleOnChange}
            loadOptions={loadOptions}
        />
    );
}

export default Search;