import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
/**
 * @deprecated Redundant page. Redirecting to consolidated HomePage.
 */
export function GlobalMonitorPage() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/', { replace: true });
  }, [navigate]);
  return null;
}