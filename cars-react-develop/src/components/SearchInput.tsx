import { useNavigate, useLocation } from "react-router-dom";
import "./styles/searchInput.css";
import { useTranslation } from "react-i18next";
import { useTranslationApi } from "../hooks/useTranslationApi";

const SearchInput = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchQuery = formData.get("q") as string;

    if (searchQuery.trim()) {
      // Get existing URL parameters
      const currentParams = new URLSearchParams(location.search);
      currentParams.set("search_query", searchQuery.trim());
      currentParams.set("page", "1"); // Reset to first page on new search

      // If we're already on the search page, use replace to update URL
      if (location.pathname === "/search") {
        navigate(`/search?${currentParams.toString()}`, {
          replace: true,
        });
      } else {
        // If we're on a different page, navigate to search page
        navigate(`/search?${currentParams.toString()}`);
      }
    }
  };
  const { t } = useTranslationApi();
  return (
    <form onSubmit={handleSubmit} className="_30YJ-root">
      <div className="_cPDc-root">
        <button type="button" className="_cPDc-trigger qa_auc_t_button">
          <span className="_cPDc-label">{t("header.all")}</span>{" "}
          <div className="_cPDc-triangle"></div>
        </button>
        <div></div>
      </div>
      <input
        className="_30YJ-input qa_id_search_field"
        type="search"
        name="q"
        placeholder={t("header.searchInput")}
        aria-label="Search Vehicles by Make, Model, Year, Vin, etc"
      />
      <button
        type="submit"
        className="_30YJ-button qa_submit_search_button"
        aria-label="Submit search"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M11.4368 10.0637H10.7104L10.4582 9.81316C11.3845 8.73813 11.8936 7.36589 11.8926 5.94671C11.8926 5.1657 11.7388 4.39235 11.4399 3.6708C11.1411 2.94926 10.7031 2.29366 10.1509 1.74144C9.59872 1.18923 8.9432 0.751216 8.22177 0.452417C7.50034 0.153618 6.72712 -0.000114202 5.94629 6.36608e-08C5.16552 -0.0001142 4.39238 0.153589 3.67101 0.452334C2.94963 0.751079 2.29415 1.18901 1.74199 1.74113C1.18982 2.29326 0.751792 2.94876 0.452901 3.6702C0.15401 4.39164 0.000114285 5.16491 6.36471e-08 5.94584C-0.000114196 6.72692 0.153613 7.50037 0.452402 8.22202C0.75119 8.94366 1.18919 9.59936 1.74137 10.1517C2.29356 10.704 2.94912 11.1421 3.67061 11.4409C4.39209 11.7398 5.16538 11.8935 5.94629 11.8934C7.36463 11.8947 8.73621 11.3861 9.81103 10.4605L10.0633 10.711V11.4358L14.6361 16L16 14.6358L11.4368 10.0637ZM5.94629 10.0637C5.40535 10.0643 4.86961 9.9582 4.36971 9.75149C3.86981 9.54478 3.41556 9.24152 3.03293 8.85906C2.65031 8.4766 2.34683 8.02244 2.13985 7.52256C1.93287 7.02268 1.82645 6.48689 1.82668 5.94584C1.82668 5.40511 1.93318 4.86968 2.14009 4.37012C2.347 3.87057 2.65027 3.41667 3.03258 3.03436C3.41489 2.65205 3.86875 2.34881 4.36824 2.14196C4.86773 1.93511 5.40307 1.82871 5.94368 1.82882C7.03542 1.82882 8.08246 2.26255 8.85453 3.03461C9.62659 3.80668 10.0604 4.85386 10.0607 5.94584C10.0609 7.03759 9.62758 8.08473 8.85601 8.85696C8.08444 9.62919 7.0378 10.0633 5.94629 10.0637Z"
            fill="#333333"
          ></path>
        </svg>
      </button>
    </form>
  );
};

export default SearchInput;
