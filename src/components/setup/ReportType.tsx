import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';

const ReportType: React.FC = () => {
    const [reportType, setReportType] = useState('');
    const [reportTypes, setReportTypes] = useState<string[]>([]);

    useEffect(() => {
        fetchReportTypes();
    }, []);

    const fetchReportTypes = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found');
            return;
        }

        try {
            const response = await fetch('https://api.tracenac.com/api/report/report-type', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch report types');
            }

            const data = await response.json();
            setReportTypes(data.data.map((type: { name: string }) => type.name));
        } catch (error) {
            console.error('Error fetching report types:', error);
        }
    };

    const handleAddReportType = async () => {
        if (reportType.trim() !== '') {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found');
                return;
            }

            try {
                const response = await fetch('https://api.tracenac.com/api/report/report-type', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({ name: reportType }),
                });

                if (!response.ok) {
                    throw new Error('Failed to add report type');
                }

                setReportTypes([...reportTypes, reportType]);
                setReportType('');
            } catch (error) {
                console.error('Error adding report type:', error);
            }
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Report Type</h1>
            <div className="flex items-center space-x-4">
                <Input
                    type="text"
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    placeholder="Enter report type"
                    className="flex-1"
                />
                <Button onClick={handleAddReportType}>Add Report Type</Button>
            </div>
            <table className="min-w-full bg-white border border-gray-200">
                <thead>
                    <tr>
                        <th className="px-4 py-2 border-b">Report Types</th>
                    </tr>
                </thead>
                <tbody>
                    {reportTypes.map((type, index) => (
                        <tr key={index}>
                            <td className="px-4 py-2 border-b">{type}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ReportType;