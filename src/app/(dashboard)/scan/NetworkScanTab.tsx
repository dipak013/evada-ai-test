interface NetworkNode {
  id: string;
  type: string;
  label: string;
  ip?: string;
  ports?: number[];
  service?: string;
  product?: string;
  status?: string;
  riskScore?: string;
  hostname?: string;
  exploitable?: boolean;
  findings?: any[];
}

interface NetworkEdge {
  source: string;
  target: string;
  label?: string;
}

interface NetworkScan {
  id: string;
  application_id: string;
  job_id: string;
  graph_json: any;
  executed_at: string;
}

interface ParsedNetworkData {
  meta: {
    cidr?: string;
    scan_time?: string;
    scan_id?: string;
    risk_level?: string;
  };
  nodes: NetworkNode[];
  edges: NetworkEdge[];
}

interface NetworkScanTabProps {
  isUploading: boolean;
  networkScan: NetworkScan | null;
  parsedNetworkData: ParsedNetworkData | null;
  isNetworkScanning: boolean;
  networkScanError: string | null;
  selectedNode: any;
  setSelectedNode: (node: any) => void;
  handleNetworkScan: () => void;
  handleNodeClick: (node: any) => void;
  detailPanelRef: React.RefObject<HTMLDivElement | null>;
  // Pass the network visualization as children for maximum flexibility
  networkVisualization: React.ReactNode;
}

export function NetworkScanTab({
  isUploading,
  networkScan,
  parsedNetworkData,
  isNetworkScanning,
  networkScanError,
  handleNetworkScan,
  networkVisualization
}: NetworkScanTabProps) {
  return (
    <>
      {!isUploading && (
        <div className="bg-white rounded-b-xl shadow-sm border border-t-0 border-gray-200">
          {/* Scan Summary */}
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Network Scan Summary</h2>
              <button
                onClick={handleNetworkScan}
                disabled={isNetworkScanning}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-2.5 rounded-lg font-semibold shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isNetworkScanning ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Scanning...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3.5a5.5 5.5 0 105.5 5.5M15 9a6 6 0 11-12 0 6 6 0 0112 0z" />
                      <circle cx="9" cy="9" r="1.5" fill="currentColor" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.5 16.5l4.5 4.5" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5.5c1.933 0 3.5 1.567 3.5 3.5M9 7c1.105 0 2 .895 2 2" opacity="0.6" />
                    </svg>
                    Scan Network
                  </>
                )}
              </button>
            </div>
            {networkScanError && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                <p className="text-sm font-medium">Error: {networkScanError}</p>
              </div>
            )}
            {networkScan ? (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Network CIDR:</p>
                  <p className="text-base font-semibold text-gray-800">{networkScan.graph_json?.meta?.cidr || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Scan Time:</p>
                  <p className="text-base font-semibold text-gray-800">
                    {new Date(networkScan.graph_json?.meta?.scan_time || networkScan.executed_at).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Nodes:</p>
                  <p className="text-base font-semibold text-gray-800">{networkScan.graph_json?.nodes?.length || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Edges:</p>
                  <p className="text-base font-semibold text-gray-800">{networkScan.graph_json?.edges?.length || 0}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-600">No network scan data available</p>
            )}
          </div>

          {/* Discovered Nodes Table */}
          {networkScan && networkScan.graph_json?.nodes && networkScan.graph_json.nodes.length > 0 && (
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Discovered Nodes</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-indigo-600">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                        Node ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                        Label
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                        IP Address
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                        Open Ports
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {parsedNetworkData && parsedNetworkData.nodes.map((node: NetworkNode, index: number) => (
                      <tr key={node.id || index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-900">{node.id}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                            node.type === 'network' ? 'bg-indigo-100 text-indigo-700' :
                            node.type === 'host' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {node.type}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-900">{node.label}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-700">{node.ip || 'N/A'}</span>
                        </td>
                        <td className="px-6 py-4">
                          {node.ports && node.ports.length > 0 ? (
                            <div className="flex items-center gap-1 flex-wrap">
                              {node.ports.map((port: number, idx: number) => (
                                <span key={idx} className="text-sm text-gray-700">
                                  {port}{idx < (node.ports?.length || 0) - 1 && ','}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">N/A</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Network Diagram Visualization - Passed as children from parent */}
          {networkVisualization}

          {/* No Network Data Message */}
          {(!networkScan || !parsedNetworkData || parsedNetworkData.nodes.length === 0) && !isNetworkScanning && (
            <div className="p-12 flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No Network Data Available</h3>
              <p className="text-sm text-gray-600 text-center max-w-md mb-4">
                Network topology data has not been generated yet. Click the "Scan Network" button above to perform a network scan.
              </p>
            </div>
          )}

          {/* Loading State During Network Scan */}
          {isNetworkScanning && (
            <div className="p-12 flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <svg className="animate-spin h-10 w-10 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Network Scan in Progress</h3>
              <p className="text-sm text-gray-600 text-center max-w-md">
                Scanning network for hosts, services, and vulnerabilities. This may take a few moments...
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
}
