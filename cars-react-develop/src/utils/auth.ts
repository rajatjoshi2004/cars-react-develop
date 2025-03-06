export const isAuthenticated = () => {
    return !!localStorage.getItem("token"); // Assuming token is stored
};
