import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { debounce } from "../../Config/Debounce";
import { searchUserAction } from "../../Redux/User/Action";
import "./SearchComponent.css";
import SearchUserCard from "./SearchUserCard";
import { Input, Typography, Spin, Empty } from "antd";
import { SearchOutlined, UserOutlined, CloseOutlined } from "@ant-design/icons";

const { Text } = Typography;

const SearchComponent = ({ setIsSearchVisible }) => {
  const token = localStorage.getItem("token");
  const { user } = useSelector(store => store);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchUser = (query) => {
    if (query.trim() === "") {
      dispatch(searchUserAction({ jwt: token, query: "" }));
      return;
    }
    setIsLoading(true);
    const data = {
      jwt: token,
      query,
    };
    dispatch(searchUserAction(data));
    setTimeout(() => setIsLoading(false), 1000);
  };

  const debouncedHandleSearchUser = debounce(handleSearchUser, 500);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    debouncedHandleSearchUser(value);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    dispatch(searchUserAction({ jwt: token, query: "" }));
  };

  return (
    <div className="search-container">
      <div className="search-header">
        <div className="search-title">
          <UserOutlined />
          Search Users
        </div>
        <div className="search-input-container">
          <SearchOutlined className="search-icon" />
          <Input
            value={searchQuery}
            onChange={handleInputChange}
            className="search-input"
            placeholder="Search by username..."
            allowClear={{
              clearIcon: <CloseOutlined onClick={handleClearSearch} />,
            }}
          />
        </div>
      </div>

      <div className="search-results">
        {isLoading ? (
          <div className="search-results-loading">
            <Spin size="large" />
            <Text className="search-results-loading-text">
              Searching users...
            </Text>
          </div>
        ) : user?.searchResult?.isError ? (
          <div className="search-results-error">
            <UserOutlined className="search-results-error-icon" />
            <Text className="search-results-error-text">
              No users found
            </Text>
          </div>
        ) : user?.searchResult?.length === 0 ? (
          <div className="search-results-empty">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <Text className="search-results-empty-text">
                  Start typing to search for users
                </Text>
              }
            />
          </div>
        ) : (
          user?.searchResult?.map((item) => (
            <SearchUserCard
              key={item.id}
              username={item.username}
              image={item?.image}
              setIsSearchVisible={setIsSearchVisible}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default SearchComponent;
