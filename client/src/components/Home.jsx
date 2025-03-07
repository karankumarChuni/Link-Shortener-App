import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setUrls, setLoading, setError } from "../store/urlSlice";
import { shortenUrl, getUrlStats } from "../api/api";
import { ChevronDown, ChevronUp, Copy, ExternalLink } from "lucide-react";

function Home() {
  const [url, setUrl] = useState("");
  const [expandedUrl, setExpandedUrl] = useState(null);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { urls, loading, error } = useSelector((state) => state.url);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      fetchUrls();
    }
  }, [isAuthenticated]);

  const fetchUrls = async () => {
    try {
      dispatch(setLoading(true));
      const response = await getUrlStats();
      dispatch(setUrls(response.data));
    } catch (error) {
      dispatch(setError("Failed to fetch URLs"));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      dispatch(setLoading(true));
      await shortenUrl(url);
      setUrl("");
      fetchUrls();
    } catch (error) {
      dispatch(setError("Failed to shorten URL"));
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gray-800 p-8 rounded-xl shadow-2xl mb-8">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Shorten Your URL
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-4">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter your long URL here..."
              className="flex-1 px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
              required
            />
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-lg transition-colors"
              disabled={loading}
            >
              {loading ? "Shortening..." : "Shorten"}
            </button>
          </div>
        </form>
      </div>

      {error && (
        <div className="bg-red-500 text-white p-4 rounded-lg mb-8">{error}</div>
      )}

      {isAuthenticated && urls.length > 0 && (
        <div className="bg-gray-800 p-8 rounded-xl shadow-2xl">
          <h2 className="text-2xl font-bold mb-6">Your Shortened URLs</h2>
          <div className="space-y-4">
            {urls.map((urlData) => (
              <div
                key={urlData.shortUrl}
                className="bg-gray-700 rounded-lg p-4"
              >
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <p className="text-lg font-medium truncate">
                      {urlData.originalUrl}
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      <p className="text-blue-400">
                        {`http://localhost:5000/api/urls/${urlData.shortUrl}`}
                      </p>
                      <button
                        onClick={() =>
                          copyToClipboard(
                            `http://localhost:5000/api/urls/${urlData.shortUrl}`
                          )
                        }
                        className="text-gray-400 hover:text-white"
                      >
                        <Copy size={16} />
                      </button>
                      <a
                        href={urlData.originalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-white"
                      >
                        <ExternalLink size={16} />
                      </a>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      setExpandedUrl(
                        expandedUrl === urlData.shortUrl
                          ? null
                          : urlData.shortUrl
                      )
                    }
                    className="ml-4"
                  >
                    {expandedUrl === urlData.shortUrl ? (
                      <ChevronUp size={24} />
                    ) : (
                      <ChevronDown size={24} />
                    )}
                  </button>
                </div>

                {expandedUrl === urlData.shortUrl && (
                  <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-600">
                    <div className="text-center">
                      <p className="text-gray-400">Today</p>
                      <p className="text-2xl font-bold">
                        {urlData.todayClicks}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-400">This Week</p>
                      <p className="text-2xl font-bold">
                        {urlData.weeklyClicks}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-400">This Month</p>
                      <p className="text-2xl font-bold">
                        {urlData.monthlyClicks}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-400">Total Clicks</p>
                      <p className="text-2xl font-bold">
                        {urlData.totalClicks}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
