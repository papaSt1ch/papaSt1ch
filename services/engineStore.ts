
import { Engine, EngineStatus, ReliabilityReport, BreakdownCategory } from '../types';
import { engines as staticEngines } from '../data/engines';

const CONTRIBUTIONS_KEY = 'motoengine_contributions';
const REPORTS_KEY = 'motoengine_reliability_reports';

export const engineStore = {
  // Получить все активные моторы с расчитанной статистикой
  getAllActive: (): Engine[] => {
    const userEngines = engineStore.getContributions().filter(e => e.status === 'approved');
    const all = [...staticEngines, ...userEngines];
    const reports = engineStore.getAllReports();

    return all.map(engine => {
      const engineReports = reports.filter(r => r.engineId === engine.id);
      return {
        ...engine,
        reportsCount: engineReports.length,
        reliabilityIndex: engineStore.calculateReliabilityIndex(engineReports)
      };
    });
  },

  calculateReliabilityIndex: (reports: ReliabilityReport[]): number => {
    if (reports.length === 0) return 75; // Базовое значение при отсутствии данных
    
    let score = 100;
    const breakdownPenalty = 20; // Штраф за наличие любой поломки
    
    const reportsWithBreakdowns = reports.filter(r => r.hasBreakdowns);
    const breakdownRate = reportsWithBreakdowns.length / reports.length;
    
    // Снижаем за процент поломок
    score -= (breakdownRate * 50);
    
    // Поощряем за высокий средний пробег
    const avgMileage = reports.reduce((acc, r) => acc + r.mileage, 0) / reports.length;
    const mileageBonus = Math.min(avgMileage / 10, 20); // Максимум +20 баллов за пробег
    
    score += mileageBonus;
    
    return Math.max(0, Math.min(100, Math.round(score)));
  },

  getContributions: (): Engine[] => {
    const data = localStorage.getItem(CONTRIBUTIONS_KEY);
    return data ? JSON.parse(data) : [];
  },

  submitNew: (engineData: Omit<Engine, 'id' | 'status' | 'createdAt'>, authorId: string): Engine => {
    const contributions = engineStore.getContributions();
    const exists = contributions.find(e => e.index.toLowerCase() === engineData.index.toLowerCase()) || 
                   staticEngines.find(e => e.index.toLowerCase() === engineData.index.toLowerCase());
                   
    if (exists) throw new Error(`Мотор с индексом ${engineData.index} уже существует.`);

    const newEngine: Engine = {
      ...engineData,
      id: `user_${Math.random().toString(36).substr(2, 9)}`,
      status: 'pending',
      authorId,
      createdAt: new Date().toISOString()
    };

    contributions.push(newEngine);
    localStorage.setItem(CONTRIBUTIONS_KEY, JSON.stringify(contributions));
    return newEngine;
  },

  // Работа с отчетами
  getAllReports: (): ReliabilityReport[] => {
    const data = localStorage.getItem(REPORTS_KEY);
    return data ? JSON.parse(data) : [];
  },

  submitReport: (reportData: Omit<ReliabilityReport, 'id' | 'createdAt'>): ReliabilityReport => {
    const reports = engineStore.getAllReports();
    
    // Проверка на спам (не более 1 отчета по одному мотору от юзера в сутки)
    const today = new Date().toISOString().split('T')[0];
    const existing = reports.find(r => 
      r.userId === reportData.userId && 
      r.engineId === reportData.engineId && 
      r.createdAt.startsWith(today)
    );
    if (existing) throw new Error('Вы уже отправляли отчет по этому мотору сегодня.');

    const newReport: ReliabilityReport = {
      ...reportData,
      id: `rep_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString()
    };

    reports.push(newReport);
    localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
    return newReport;
  },

  getEngineStats: (engineId: string) => {
    const reports = engineStore.getAllReports().filter(r => r.engineId === engineId);
    if (reports.length === 0) return null;

    const breakdownDist: Record<string, number> = {};
    Object.values(BreakdownCategory).forEach(cat => breakdownDist[cat] = 0);
    
    reports.forEach(r => {
      r.breakdownCategories.forEach(cat => {
        breakdownDist[cat]++;
      });
    });

    return {
      total: reports.length,
      noBreakdowns: reports.filter(r => !r.hasBreakdowns).length,
      avgMileage: reports.reduce((acc, r) => acc + r.mileage, 0) / reports.length,
      breakdownDist
    };
  },

  moderate: (engineId: string, status: EngineStatus, comment?: string) => {
    const contributions = engineStore.getContributions();
    const index = contributions.findIndex(e => e.id === engineId);
    if (index !== -1) {
      contributions[index].status = status;
      if (comment) contributions[index].moderatorComment = comment;
      localStorage.setItem(CONTRIBUTIONS_KEY, JSON.stringify(contributions));
    }
  }
};
