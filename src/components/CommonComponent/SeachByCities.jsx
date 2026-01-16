// /** @format */
const SearchByCity = () => {
  const cities = [
    ["Atlanta, GA", "Austin, TX", "Baltimore, MD", "Boston, MA", "Chicago, IL", "Cleveland, OH"],
    ["Columbus, OH", "Dallas, TX", "Denver, CO", "Detroit, MI", "Houston, TX", "Las Vegas, NV"],
    ["Los Angeles, CA", "Miami, FL", "Nashville, TN", "New York, NY", "Orlando, FL", "Philadelphia, PA"],
    ["Pittsburgh, PA", "Phoenix, AZ", "Portland, OR", "Salt Lake City, UT", "San Diego, CA"],
    ["San Francisco, CA", "Seattle, WA", "St. Louis, MO", "Tampa, FL", "See more"]
  ];

  return (
    <div className="container-fluid px-lg-4 py-4">
      <h3 className="text-center cities_heading text-[38px] mb-4">Search for items by city</h3>
      <div className="row justify-content-lg-between px-lg-3">
        {cities.map((group, index) => (
          <div key={index} className="col-6 col-sm-6 col-md-4 col-lg-3 col-xl-2 mb-3">
            <ul className="cities">
              {group.map((city, idx) => (
                <li key={idx} className="searchbycity-cities list_group  text-dark cursor-pointer hover:text-primary">
                  {city}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchByCity;
// const SeachByCities = () => {
//   return (
//     <>
//       <div className="searchbycity-container">
//         <h3>Search for items by city</h3>
//         <div className="searchbycity-city-div">
//           <div className="searchbycity-cities">
//             <ul>
//               <li>Atlanta, GA</li>
//               <li>Austin, TX</li>
//               <li>Baltimore, MD</li>
//               <li>Boston, MA</li>
//               <li>Chicago, IL</li>
//               <li>Cleveland, OH</li>
//             </ul>
//           </div>
//           <div className="searchbycity-cities">
//             <ul>
//               <li>Columbus, OH</li>
//               <li>Dallas, TX</li>
//               <li>Denver, CO</li>
//               <li>Detroit, MI</li>
//               <li>Houston, TX</li>
//               <li>Las Vegas, NV</li>
//             </ul>
//           </div>
//           <div className="searchbycity-cities">
//             <ul>
//               <li>Los Angeles, CA</li>
//               <li>Miami, FL</li>
//               <li>Nashville, TN</li>
//               <li>New York, NY</li>
//               <li>Orlando, FL</li>
//               <li>Philadelphia, PA</li>
//             </ul>
//           </div>
//           <div className="searchbycity-cities">
//             <ul>
//               <li>Pittsburgh, PA</li>
//               <li>Phoenix, AZ</li>
//               <li>Portland, OR</li>
//               <li>Salt Lake City, UT</li>
//               <li>San Diego, CA</li>
//             </ul>
//           </div>
//           <div className="searchbycity-cities">
//             <ul>
//               <li>San Francisco, CA</li>
//               <li>Seattle, WA</li>
//               <li>St. Louis, MO</li>
//               <li>Tampa, FL</li>
//               <li>See more</li>
//             </ul>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default SeachByCities;
