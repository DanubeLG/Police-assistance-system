async function validatePlaceInLocation(place, location) {

  if (!place || !location) {
    alert("Please enter both place and location");
    return false;
  }

  const url =
   `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${encodeURIComponent(place)}`;

  try {

    const res = await fetch(url, {
      headers: { "User-Agent": "FIR-System" }
    });

    const data = await res.json();

    if (data.length === 0) {
      alert("Place not found");
      return false;
    }

    const address = data[0].address;

    const hierarchy = [
      address.city,
      address.town,
      address.village,
      address.county,
      address.state,
      address.country
    ].filter(Boolean).map(x => x.toLowerCase());

    if (hierarchy.includes(location.toLowerCase())) {

      return true;

    } else {

      contradictions.push("Weapon mismatch between FIR and statement.");
      return false;
    }

  } catch (error) {

    alert("Error validating location");
    return false;
  }
}
