import { useState } from "react";
import { AsyncPaginate } from "react-select-async-paginate";
import { geoApiConfig, GEO_REQUEST_URL } from "../../netWorkConfig";

const Search = ({ onSearchChange }) => {
    const [search, setSearch] = useState(null);

    const loadOptions = (inputValue) => {
        console.log(inputValue);
        return fetch(`${GEO_REQUEST_URL}/cities?minPopulation=1000000&namePrefix=${inputValue}`, 
            geoApiConfig)
            .then((response) => response.json())
            .then((response) => {
                return({
                    options:response.data.map((city) => {
                        console.log(`search.js:${[city.latitude,city.longitude,city.name,city.countryCode]}`);
                        return {
                            value:`${city.latitude} ${city.longitude}`,
                            label:`${city.name},${city.countryCode}`
                        }
                    })
                })
            })
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