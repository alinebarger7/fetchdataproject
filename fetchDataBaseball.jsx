const Pagination = ({ items, pageSize, onPageChange }) => {
  const { Button } = ReactBootstrap;
  if (items.length <= 1) return null;

  let num = Math.ceil(items.length / pageSize);
  let pages = range(1, num + 1);
  const list = pages.map((page) => {
    return (
      <Button key={page} onClick={onPageChange} className="page-item">
        {page}
      </Button>
    );
  });
  return (
    <nav>
      <ul className="pagination">{list}</ul>
    </nav>
  );
};
const range = (start, end) => {
  return Array(end - start + 1)
    .fill(0)
    .map((item, i) => start + i);
};
function paginate(items, pageNumber, pageSize) {
  const start = (pageNumber - 1) * pageSize;
  let page = items.slice(start, start + pageSize);
  return page;
}
const useDataApi = (initialUrl, initialData) => {
  const { useState, useEffect, useReducer } = React;
  const [url, setUrl] = useState(initialUrl);

  const [state, dispatch] = useReducer(dataFetchReducer, {
    isLoading: false,
    isError: false,
    data: initialData,
  });

  useEffect(() => {
    let didCancel = false;
    const fetchData = async () => {
      dispatch({ type: "FETCH_INIT" });
      try {
        const result = await axios(url);
        if (!didCancel) {
          dispatch({ type: "FETCH_SUCCESS", payload: result.data });
        }
      } catch (error) {
        if (!didCancel) {
          dispatch({ type: "FETCH_FAILURE" });
        }
      }
    };
    fetchData();
    return () => {
      didCancel = true;
    };
  }, [url]);
  return [state, setUrl];
};
const dataFetchReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_INIT":
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case "FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case "FETCH_FAILURE":
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    default:
      throw new Error();
  }
};
// App that gets data from Hacker News url
function App() {
  const { Fragment, useState, useEffect, useReducer } = React;
  const [query, setQuery] = useState("MIT");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [{ data, isLoading, isError }, doFetch] = useDataApi(
    "http://lookup-service-prod.mlb.com",
    {
      hits: [],
    }
  );
  const handlePageChange = (e) => {
    setCurrentPage(Number(e.target.textContent));
  };
  let page = data.hits;
  if (page.length >= 1) {
    page = paginate(page, currentPage, pageSize);
    console.log(`currentPage: ${currentPage}`);
  }
  <Fragment>
  <form
    onSubmit={event => {
      alert = () => "The player was submitted";
      console.log(`./severalplayers.json${query}`);
      event.preventDefault();
    }}
  >
    <input
      className='search_input'
      type="text"
      value={query}
      onChange={event => setQuery(event.target.value)}
    />
    <button className='search_button' type="submit">Search</button>
  </form>

  {isError && <div>Something went wrong ...</div>}

  {isLoading ? (
    <div>Loading ...</div>
  ) : (
    <nav>
    <ul className='temp_ul'>
      {playerStats.map(item => (
        <li className='temp_li' key={item.player}>
          <p className='temp_p'>{item.player} is hitting {item.battingAverage}</p>
        </li>
      ))}
    </ul>
    <p className="p_info">*Type in a player's full name exactly as it is written, such as: Babe Ruth</p>
    </nav>
  )}
  <Pagination>
    items={data.hits}
    pageSize={pageSize}
    onPageChange={handlePageChange}
  </Pagination>
</Fragment>
}

// ========================================
ReactDOM.render(<App />, document.getElementById("root"));
