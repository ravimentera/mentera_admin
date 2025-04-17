"use client";

import { useState } from "react";
import SearchForm from "./components/SearchForm";
import RadixTable from "./components/RadixTable";
import ContactsTable from "./components/ContactsTable";
import SimpleContactsList from "./components/SimpleContactsList";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState([]);
  const [cityName, setCityName] = useState("");
  const [contactsLoading, setContactsLoading] = useState(false);
  const [contactsData, setContactsData] = useState(null);

  // Define columns for the data table
  const columns = [
    { key: "name", label: "Name" },
    { key: "address", label: "Address" },
    { key: "phone", label: "Phone" },
    { key: "website", label: "Website" },
    { key: "googleMaps", label: "Maps Link" },
    { key: "hours", label: "Hours" },
  ];

  const extractContactsFromWebsite = async (website) => {
    if (!website || website === "N/A") {
      return null;
    }

    setContactsLoading(true);
    try {
      const response = await fetch(
        `/api/extract-contacts?url=${encodeURIComponent(website)}`,
      );
      if (!response.ok) {
        console.error("Failed to extract contacts:", await response.text());
        return null;
      }

      const data = await response.json();
      setContactsData(data.data);
      return data.data;
    } catch (error) {
      console.error("Error extracting contacts:", error);
      return null;
    } finally {
      setContactsLoading(false);
    }
  };

  const handleSearch = async (city) => {
    setLoading(true);
    setError(null);
    setResults([]);
    setContactsData(null);
    setCityName(city);

    try {
      // Fetch only the JSON data, no automatic CSV download
      const response = await fetch(
        `/api/fetch-medspas?city=${encodeURIComponent(city)}`,
        {
          method: "GET",
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch data");
      }

      const data = await response.json();
      setResults(data.data); // Store results for table display
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="main-layout">
        {/* Left Panel - Search Form Card */}
        <div className="left-panel">
          <div className="card form-div">
            <h1>MedSpa Finder</h1>

            <SearchForm onSearch={handleSearch} isLoading={loading} />

            {error && <div className="error-box">{error}</div>}

            {loading && (
              <div className="spinner-container">
                <div className="spinner"></div>
                <p className="spinner-text">Searching for medical spas...</p>
                <p className="spinner-subtext">
                  This may take up to a minute for comprehensive results
                </p>
              </div>
            )}

            {/* Contact Extraction Section - moved to form div */}
            {results.length > 0 && !loading && (
              <div className="contact-extraction-section">
                <h3>Extract Contact Information</h3>
                <p>Select a med spa to extract emails and social media links</p>

                <div className="website-selector">
                  <select
                    onChange={(e) =>
                      e.target.value &&
                      extractContactsFromWebsite(e.target.value)
                    }
                    disabled={contactsLoading}
                    className="website-select"
                  >
                    <option value="">-- Select a website --</option>
                    {results
                      .filter(
                        (result) => result.website && result.website !== "N/A",
                      )
                      .map((result, index) => (
                        <option key={index} value={result.website}>
                          {result.name}
                        </option>
                      ))}
                  </select>

                  {contactsLoading && <div className="mini-spinner"></div>}
                </div>

                {/* Display contact information as a simple list */}
                {contactsData && (
                  <SimpleContactsList
                    data={contactsData}
                    isLoading={contactsLoading}
                  />
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Results Tables */}
        <div className="right-panel">
          {results.length > 0 && !loading ? (
            <>
              {/* Results Table */}
              <div className="card results-widget">
                <div className="results-header">
                  <h2>Medical Spas in {cityName}</h2>
                  <div className="download-info">
                    <button
                      onClick={() =>
                        window.open(
                          `/api/fetch-medspas?city=${encodeURIComponent(cityName)}&format=csv`,
                          "_blank",
                        )
                      }
                      className="download-button"
                    >
                      Download CSV
                    </button>
                  </div>
                </div>
                <RadixTable data={results} columns={columns} />
              </div>

              {/* Contact data display moved to left panel */}
            </>
          ) : (
            !loading && (
              <div className="card placeholder-message">
                <p className="text-center">
                  Enter a city name and click search to see results here
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
