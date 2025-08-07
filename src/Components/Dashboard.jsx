import React, { useState } from "react";
import * as XLSX from "xlsx";
import dayjs from "dayjs";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
Chart.register(ArcElement, Tooltip, Legend);

// Set your conversion rates here
const USD_PER_INPUT_TOKEN = 0.0000025;
const USD_PER_OUTPUT_TOKEN = 0.00001;
const INR_PER_USD = 87.68; // Example value, update as needed

function Dashboard() {
    const [allData, setAllData] = useState([]);
    const [projects, setProjects] = useState([]);
    const [months, setMonths] = useState([]);
    const [dates, setDates] = useState([]);
    const [fileError, setFileError] = useState("");
    const [selectedProject, setSelectedProject] = useState("All Projects");
    const [selectedMonth, setSelectedMonth] = useState("");
    const [selectedStartDate, setSelectedStartDate] = useState("");
    const [selectedEndDate, setSelectedEndDate] = useState("");
    const [filteredData, setFilteredData] = useState([]);
    const [summary, setSummary] = useState(null);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        setFileError("");
        if (!file) return;
        if (!file.name.endsWith(".xlsx")) {
            setFileError("Please upload a valid .xlsx file");
            return;
        }

        const reader = new FileReader();
        reader.onload = (evt) => {
            const data = evt.target.result;
            const workbook = XLSX.read(data, { type: "binary" });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const json = XLSX.utils.sheet_to_json(sheet);

            setAllData(json);

            // Project names
            const projectSet = new Set();
            json.forEach((row) => {
                if (row["Application Name"]) {
                    projectSet.add(row["Application Name"]);
                }
            });
            setProjects([...projectSet]);

            // Months and Dates
            const monthSet = new Set();
            const dateSet = new Set();
            json.forEach((row) => {
                const date = row["Date & Time"];
                if (date) {
                    dateSet.add(date);
                    monthSet.add(date.slice(0, 7));
                }
            });
            setMonths([...monthSet].sort());
            setDates([...dateSet].sort());
            // Reset filters
            setSelectedProject("All Projects");
            setSelectedMonth("");
            setSelectedStartDate("");
            setSelectedEndDate("");
            setFilteredData(json);
            calculateSummary(json);
        };
        reader.readAsBinaryString(file);
    };

    // Filter and calculate when "View" is clicked
    const handleView = () => {
        let data = allData;

        // Project filter
        if (selectedProject && selectedProject !== "All Projects") {
            data = data.filter(row => row["Application Name"] === selectedProject);
        }

        // Month filter
        if (selectedMonth && !["last7", "lastMonth", "thisYear"].includes(selectedMonth)) {
            data = data.filter(row => row["Date & Time"] && row["Date & Time"].startsWith(selectedMonth));
        }

        // Presets
        if (selectedMonth === "last7") {
            const last7 = dayjs().subtract(7, "day");
            data = data.filter(row => row["Date & Time"] && dayjs(row["Date & Time"]).isAfter(last7));
        }
        if (selectedMonth === "lastMonth") {
            const start = dayjs().subtract(1, "month").startOf("month");
            const end = dayjs().subtract(1, "month").endOf("month");
            data = data.filter(row => {
                const d = row["Date & Time"];
                return d && dayjs(d).isAfter(start.subtract(1, "day")) && dayjs(d).isBefore(end.add(1, "day"));
            });
        }
        if (selectedMonth === "thisYear") {
            const thisYear = dayjs().year();
            data = data.filter(row => row["Date & Time"] && dayjs(row["Date & Time"]).year() === thisYear);
        }

        // Date range filter
        if (selectedStartDate) {
            data = data.filter(row => row["Date & Time"] && row["Date & Time"] >= selectedStartDate);
        }
        if (selectedEndDate) {
            data = data.filter(row => row["Date & Time"] && row["Date & Time"] <= selectedEndDate);
        }

        setFilteredData(data);
        calculateSummary(data);
    };

    const calculateSummary = (data) => {
        let inputTokens = 0, outputTokens = 0;
        data.forEach(row => {
            inputTokens += Number(row["Input Token"] || 0);
            outputTokens += Number(row["Output Token"] || 0);
        });

        const inputUSD = inputTokens * USD_PER_INPUT_TOKEN;
        const outputUSD = outputTokens * USD_PER_OUTPUT_TOKEN;
        const overallUSD = inputUSD + outputUSD;

        const inputINR = inputUSD * INR_PER_USD;
        const outputINR = outputUSD * INR_PER_USD;
        const overallINR = overallUSD * INR_PER_USD;

        setSummary({
            input: { usd: inputUSD, inr: inputINR, tokens: inputTokens },
            output: { usd: outputUSD, inr: outputINR, tokens: outputTokens },
            overall: { usd: overallUSD, inr: overallINR, tokens: inputTokens + outputTokens }
        });
    };

    // Date picker validation
    const handleStartDateChange = (e) => {
        const value = e.target.value;
        setSelectedStartDate(value);
        if (value && !dates.includes(value)) {
            alert("Start Date not available in data!");
        }
    };
    const handleEndDateChange = (e) => {
        const value = e.target.value;
        setSelectedEndDate(value);
        if (value && !dates.includes(value)) {
            alert("End Date not available in data!");
        }
    };

    // Initial summary on load (all data)
    React.useEffect(() => {
        if (allData.length) {
            calculateSummary(allData);
            setFilteredData(allData);
        }
    }, [allData]);

    // UI for summary cards
    const Card = ({ title, usd, inr, tokens }) => (
        <div className="ms-1" style={{
            background: "rgb(33,37,41)",
            borderRadius: "16px",
            padding: "24px",
            margin: "10px",
            minWidth: "255px",
            flex: "1",
            color: "#fff",
            textAlign: "center",

        }}>
            <div style={{ fontWeight: "600", marginBottom: "12px" }}>{title}</div>
            <div style={{ color: "#00ff99", fontSize: "2rem", fontWeight: "bold" }}>${usd.toFixed(2)}</div>
            <div style={{ color: "#aaa", fontSize: "1.1rem" }}>₹{inr.toFixed(2)}</div>
            <div style={{ fontSize: "1rem", marginTop: "10px" }}>{tokens.toLocaleString()} Tokens</div>
        </div>
    );

    return (
        <div className="row mt-0 mb-5 w-100">
            <section className="">
                <label className="form-label text-light mt-1">Upload Sample .xlsx file</label>
                <input
                    type="file"
                    accept=".xlsx"
                    onChange={handleFileUpload}
                    className="form-control  text-light border-0 mb-2 " style={{backgroundColor:'rgb(44,48,52)'}}
                />
                {fileError && <div className="text-danger small">{fileError}</div>}
            </section>

            <div className="col-12 mt-3">
                <div className="card bg-dark text-light p-4 rounded-4" style={{ background: "#232229" }}>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="mb-0 fw-bold">Filters</h5>
                        <a href="#" className="text-primary text-decoration-none small fw-semibold"
                            onClick={() => {
                                setSelectedProject("All Projects");
                                setSelectedMonth("");
                                setSelectedStartDate("");
                                setSelectedEndDate("");
                                setFilteredData(allData);
                                calculateSummary(allData);
                            }}
                        >Clear Filter</a>
                    </div>
                    <form>


                        <div className="row ">
                            {/* Project Dropdown */}
                            <div className="col-12 col-md-4 mb-3 mb-md-0">
                                <label className="form-label text-light">Project Name</label>
                                <select className="form-select  shadow-none text-light border-0"
                                    style={{ height: "45px" , backgroundColor:'rgb(44,48,52)'}}
                                    value={selectedProject}
                                    onChange={e => setSelectedProject(e.target.value)}>
                                    <option>All Projects</option>
                                    {projects.map((name) => (
                                        <option key={name}>{name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Date Range Filter */}
                            <div className="col-12 col-md-8 ">
                                <div className="card bg-dark border-0 ">
                                    <div className="row g-2 align-items-center">
                                        {/* Month Dropdown */}
                                        <div className="col-12 col-lg-4 mb-2 mb-lg-0">
                                            <label className="form-label text-light">Choose Duation</label>

                                            <select className="form-select  shadow-none text-light border-0"
                                                style={{ height: "45px" , backgroundColor:'rgb(44,48,52)' }}
                                                value={selectedMonth}
                                                onChange={e => setSelectedMonth(e.target.value)}>
                                                <option value="">Choose Duation</option>
                                                {months.map(month => (
                                                    <option key={month} value={month}>
                                                        {dayjs(month + "-01").format("MMMM YYYY")}
                                                    </option>
                                                ))}
                                                <option value="last7">Last 7 Days</option>
                                                <option value="lastMonth">Last Month</option>
                                                
                                            </select>
                                        </div>
                                        {/* Start Date */}
                                        <div className="col-6 col-lg-4">
                                            <label className="form-label text-light">Start Date</label>

                                            <input
                                                type="date"
                                                className="form-control  shadow-none text-white border-0"
                                                value={selectedStartDate}
                                                min={dates[0] || ""}
                                                max={dates[dates.length - 1] || ""}
                                                onChange={handleStartDateChange}
                                                style={{ height: "45px" ,backgroundColor:'rgb(44,48,52)' }}
                                                
                                            />
                                        </div>
                                        {/* End Date */}
                                        <div className="col-6 col-lg-4">
                                            <label className="form-label text-light">End Date</label>

                                            <input
                                                type="date"
                                                className="form-control  shadow-none text-white border-0"
                                                value={selectedEndDate}
                                                min={dates[0] || ""}
                                                max={dates[dates.length - 1] || ""}
                                                onChange={handleEndDateChange}
                                                style={{ height: "45px",backgroundColor:'rgb(44,48,52)' }}
                                            />
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center justify-content-between mt-3">
                                        <div></div>
                                        <div>
                                            <button
                                                type="button"
                                                className="btn btn-outline-light"
                                                onClick={handleView}
                                            >View</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>

                </div>

                <div>


                    {/* Calculation Cards */}
                    {summary && (
                        <div className="d-flex justify-content-between align-items-stretch mt-3 ">
                            <Card title="Input" usd={summary.input.usd} inr={summary.input.inr} tokens={summary.input.tokens} />
                            <Card title="Output" usd={summary.output.usd} inr={summary.output.inr} tokens={summary.output.tokens} />
                            <Card title="Overall" usd={summary.overall.usd} inr={summary.overall.inr} tokens={summary.overall.tokens} />
                        </div>
                    )}

                    {summary && (
                        <div className="row mt-1 mb-4 g-4">
                            {/* Left Pie Chart: Input vs Output */}
                            <div className="col-12 col-md-6">
                                <div className="chart-card p-3">
                                    <h5 className="text-light mb-3 ms-2">Cost Overview</h5>
                                    <div className="chart-wrapper ">
                                        <Pie
                                            data={{
                                                labels: [
                                                    `Input: $${summary.input.usd.toFixed(2)}`,
                                                    `Output: $${summary.output.usd.toFixed(2)}`,
                                                    `Overall: $${summary.overall.usd.toFixed(2)}`
                                                ],
                                                datasets: [
                                                    {
                                                        data: [
                                                            summary.input.usd,
                                                            summary.output.usd,
                                                            summary.overall.usd
                                                        ],
                                                        backgroundColor: [
                                                            "#99CCFF",
                                                            "#99FF99",
                                                            "#FFD700"
                                                        ],
                                                        borderColor: "#232229",
                                                        borderWidth: 2,
                                                    }
                                                ]
                                            }}
                                            options={{
                                                plugins: {
                                                    legend: {
                                                        display: true,
                                                        position: 'bottom',
                                                        align: 'center',
                                                        minWidth: '100%',
                                                        labels: {
                                                            color: '#fff', // <--- Set legend text color to white

                                                            boxWidth: 20,
                                                            padding: 24,
                                                            font: { size: 16 }
                                                        }


                                                    },
                                                    tooltip: { enabled: true }
                                                }
                                            }}
                                        />
                                    </div>



                                </div>
                            </div>

                            {/* Right Pie Chart: Full Distribution */}
                            <div className="col-12 col-md-6">
                                <div className="chart-card p-3">
                                    <h5 className="text-light mb-3 ms-2">Input vs Output</h5>
                                    <div className="chart-wrapper">
                                        <Pie
                                            data={{
                                                labels: [
                                                    `Input: $${summary.input.usd.toFixed(2)}`,
                                                    `Output: $${summary.output.usd.toFixed(2)}`
                                                ],
                                                datasets: [
                                                    {
                                                        data: [summary.input.usd, summary.output.usd],
                                                        backgroundColor: ["#99CCFF", "#99FF99"],
                                                        borderColor: "#232229",
                                                        borderWidth: 2,
                                                    }
                                                ]
                                            }}
                                            options={{
                                                plugins: {
                                                    legend: {
                                                        display: true,
                                                        position: 'bottom',
                                                        align: 'center',
                                                        minWidth: '100%',
                                                        labels: {
                                                            color: '#fff', // <--- Set legend text color to white

                                                            boxWidth: 20,
                                                            padding: 24,
                                                            font: { size: 16 }
                                                        }

                                                    },
                                                    tooltip: { enabled: true }
                                                }
                                            }}
                                        />
                                    </div>

                                </div>
                            </div>
                        </div>
                    )}

                    <div className="mt-2 p-1">
                        <h6 className="text-light">Table View</h6>
                        <div style={{ maxHeight: "430px", overflowY: "auto" }}>
                            <table className="table table-dark table-striped mt-2" style={{
                                background: "#18171d",
                                borderRadius: "12px",
                                overflow: "hidden",
                                marginBottom: 0
                            }}>
                                <thead style={{ background: "#232229", position: "sticky", top: 0, zIndex: 1 }}>
                                    <tr>
                                        <th>Identifier</th>
                                        <th>Application Name</th>
                                        <th>Step Name</th>
                                        <th>Input Token</th>
                                        <th>Output Token</th>
                                        <th>Date &amp; Time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredData.map((row, idx) => (
                                        <tr key={idx}>
                                            <td>{row["Identifier"]}</td>
                                            <td>{row["Application Name"]}</td>
                                            <td>{row["Step Name"]}</td>
                                            <td>{row["Input Token"]?.toLocaleString()}</td>
                                            <td>{row["Output Token"]?.toLocaleString()}</td>
                                            <td>{row["Date & Time"]}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </div>
        </div >
    );
}

export default Dashboard;