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

  const handleLinkClick = () => {
    setTimeout(fetchUrls, 2000);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 home-container">
      {/* URL Shortener Box */}
      <div className="bg-gray-800 p-6 md:p-8 rounded-xl shadow-2xl mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-center">
          Shorten Your URL
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter your long URL..."
              className="flex-1 px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500 w-full"
              required
            />
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors w-full sm:w-auto"
              disabled={loading}
            >
              {loading ? "Shortening..." : "Shorten"}
            </button>
          </div>
        </form>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500 text-white p-4 rounded-lg mb-6 text-center">
          {error}
        </div>
      )}

      {/* Display URLs */}
      {isAuthenticated && urls.length > 0 && (
        <div className="bg-gray-800 p-6 md:p-8 rounded-xl shadow-2xl">
          <h2 className="text-2xl font-bold mb-6">Your Shortened URLs</h2>
          <div className="space-y-4">
            {urls.map((urlData) => (
              <div
                key={urlData.shortUrl}
                className="bg-gray-700 rounded-lg p-4"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <div className="flex-1">
                    <p className="text-lg font-medium break-words">
                      {urlData.originalUrl}
                    </p>
                    <div className="flex flex-wrap items-center space-x-3 mt-2">
                      <a
                        href={`https://link-shortener-app-1.onrender.com/api/urls/${urlData.shortUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline break-all"
                        onClick={handleLinkClick}
                      >
                        {`Triveous-Tech/${urlData.shortUrl}`}{" "}
                        {/* Display as Triveous-Tech */}
                      </a>
                      <button
                        onClick={() =>
                          copyToClipboard(
                            `https://link-shortener-app-1.onrender.com/api/urls/${urlData.shortUrl}`
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
                    className="mt-4 sm:mt-0"
                  >
                    {expandedUrl === urlData.shortUrl ? (
                      <ChevronUp size={24} />
                    ) : (
                      <ChevronDown size={24} />
                    )}
                  </button>
                </div>

                {/* Stats Section */}
                {expandedUrl === urlData.shortUrl && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-600">
                    <div className="text-center">
                      <p className="text-gray-400 text-sm">Today</p>
                      <p className="text-xl font-bold">{urlData.todayClicks}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-400 text-sm">This Week</p>
                      <p className="text-xl font-bold">
                        {urlData.weeklyClicks}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-400 text-sm">This Month</p>
                      <p className="text-xl font-bold">
                        {urlData.monthlyClicks}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-400 text-sm">Total Clicks</p>
                      <p className="text-xl font-bold">{urlData.totalClicks}</p>
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
