export const formatSaleDate = (saleDate: string |null): string => {
    if (!saleDate) return "N/A"; // Handle empty/null cases
  
    const date = new Date(saleDate);
  
    // Format the date manually
    const day = date.getDate().toString().padStart(2, "0"); // Ensure 2 digits
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
  
    // Format time
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // Convert 24-hour time to 12-hour format
  
    return `${day} ${month} ${year}, ${hours}:${minutes} ${ampm}`;
  };