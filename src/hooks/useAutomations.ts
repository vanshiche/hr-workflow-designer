import { useState, useEffect } from 'react';
import { Automation, AutomationParam } from '../types/workflow.types';
import { api } from '../services/api';

interface UseAutomationsReturn {
  automations: Automation[];
  loading: boolean;
  error: string | null;
  selectedAutomation: Automation | null;
  selectedAutomationParams: AutomationParam[];
  selectAutomation: (automationId: string) => void;
  refetch: () => void;
}

export const useAutomations = (): UseAutomationsReturn => {
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAutomationId, setSelectedAutomationId] = useState<string | null>(null);

  const fetchAutomations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getAutomations();
      setAutomations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch automations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAutomations();
  }, []);

  const selectedAutomation = automations.find(a => a.id === selectedAutomationId) || null;
  const selectedAutomationParams = selectedAutomation?.params || [];

  const selectAutomation = (automationId: string) => {
    setSelectedAutomationId(automationId);
  };

  const refetch = () => {
    fetchAutomations();
  };

  return {
    automations,
    loading,
    error,
    selectedAutomation,
    selectedAutomationParams,
    selectAutomation,
    refetch,
  };
};
