import { MapPin, Clock, LogIn, LogOut, RefreshCw, AlertTriangle } from 'lucide-react';
import { useState, useEffect } from 'react';

export const GuardPWA: React.FC = () => {
  const [shifts, setShifts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [gps, setGps] = useState<{ lat?: number; lng?: number; accuracy?: number }>({});
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const token = localStorage.getItem('token');

  const fetchShifts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/guard/shifts', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setShifts(await res.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getGPSLocation = () => {
    if (!navigator.geolocation) {
      setGpsError('GPS geolocation not supported on this browser/device');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGps({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        });
        setGpsError(null);
      },
      (err) => {
        setGpsError(`GPS permission or signal error: ${err.message}`);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  useEffect(() => {
    fetchShifts();
    getGPSLocation();
  }, []);

  const handleCheckIn = async (shiftId: string) => {
    setActionMessage(null);
    try {
      const res = await fetch('/api/v1/attendance/check-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          shiftId,
          checkInLat: gps.lat,
          checkInLng: gps.lng,
          checkInAccuracy: gps.accuracy,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Check-in failed');
      }

      setActionMessage('Check-in recorded successfully!');
      fetchShifts();
    } catch (err: any) {
      setActionMessage(`Error: ${err.message}`);
    }
  };

  const handleCheckOut = async (attendanceRecordId: string) => {
    setActionMessage(null);
    try {
      const res = await fetch('/api/v1/attendance/check-out', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          attendanceRecordId,
          checkOutLat: gps.lat,
          checkOutLng: gps.lng,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Check-out failed');
      }

      setActionMessage('Check-out recorded successfully!');
      fetchShifts();
    } catch (err: any) {
      setActionMessage(`Error: ${err.message}`);
    }
  };

  // Convert to East Africa Time (UTC+3)
  const formatEAT = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleString('en-US', {
      timeZone: 'Africa/Addis_Ababa',
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  return (
    <div className="max-w-md mx-auto px-4 py-6 space-y-6 bg-surface-light min-h-screen">
      <div className="bg-emerald-900 text-white p-4 rounded-xl shadow border border-gold-500/30 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-serif font-bold">Guard Mobile Interface</h1>
          <p className="text-xs text-gold-500">Covenant Shield Security Duty App</p>
        </div>
        <button
          onClick={fetchShifts}
          className="p-2 bg-emerald-950 rounded hover:bg-emerald-800 transition"
        >
          <RefreshCw className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* GPS Status Card */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-gray-500 uppercase">
          <span className="flex items-center gap-1">
            <MapPin className="w-4 h-4 text-gold-500" /> GPS Signal
          </span>
          <button onClick={getGPSLocation} className="text-emerald-900 underline text-[10px]">
            Refresh Location
          </button>
        </div>

        {gpsError ? (
          <div className="text-xs text-red-600 flex items-center gap-1 bg-red-50 p-2 rounded">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{gpsError}</span>
          </div>
        ) : gps.lat ? (
          <div className="text-xs text-emerald-900 font-mono bg-emerald-50 p-2 rounded">
            Lat: {gps.lat.toFixed(4)}, Lng: {gps.lng?.toFixed(4)} (Acc: {gps.accuracy?.toFixed(0)}m)
          </div>
        ) : (
          <p className="text-xs text-gray-400">Acquiring satellite GPS coordinates...</p>
        )}
      </div>

      {actionMessage && (
        <div className="p-3 bg-gold-50 border border-gold-300 text-emerald-950 text-xs font-bold rounded shadow-sm">
          {actionMessage}
        </div>
      )}

      {/* Guard Shift Assignments */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase text-emerald-900 tracking-wider">Assigned Shifts</h3>

        {loading ? (
          <p className="text-xs text-gray-500">Loading guard schedule...</p>
        ) : shifts.length === 0 ? (
          <div className="bg-white p-6 rounded-lg text-center text-gray-500 text-xs border border-dashed border-gray-300">
            No upcoming shift assignments scheduled for your account.
          </div>
        ) : (
          shifts.map((shift) => {
            const att = shift.attendance?.[0];
            return (
              <div
                key={shift.id}
                className="bg-white p-5 rounded-xl border border-gray-200 shadow-md space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-emerald-900 text-base">{shift.site?.name}</h4>
                    <p className="text-xs text-gray-500">{shift.site?.address}, {shift.site?.city}</p>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded uppercase">
                    Scheduled
                  </span>
                </div>

                <div className="text-xs text-gray-600 space-y-1 bg-gray-50 p-2.5 rounded border border-gray-100">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-gold-600" />
                    <span>Start: {formatEAT(shift.startTime)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-gold-600" />
                    <span>End: {formatEAT(shift.endTime)}</span>
                  </div>
                </div>

                {att ? (
                  <div className="space-y-2 pt-2 border-t border-gray-100">
                    <div className="text-xs flex justify-between">
                      <span className="text-gray-500">Checked In:</span>
                      <span className="font-bold text-emerald-900">{formatEAT(att.checkInTime)}</span>
                    </div>

                    {att.checkOutTime ? (
                      <div className="text-xs flex justify-between">
                        <span className="text-gray-500">Checked Out:</span>
                        <span className="font-bold text-emerald-900">{formatEAT(att.checkOutTime)}</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleCheckOut(att.id)}
                        className="w-full bg-red-700 hover:bg-red-800 text-white font-bold py-2.5 rounded-lg text-xs flex items-center justify-center gap-2 shadow transition"
                      >
                        <LogOut className="w-4 h-4" /> Check Out Shift
                      </button>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => handleCheckIn(shift.id)}
                    className="w-full bg-emerald-900 hover:bg-emerald-950 text-white font-bold py-2.5 rounded-lg text-xs flex items-center justify-center gap-2 shadow transition"
                  >
                    <LogIn className="w-4 h-4 text-gold-500" /> Check In Shift
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
