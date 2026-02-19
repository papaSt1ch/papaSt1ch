
import { Engine, ReliabilityReport, Build, EngineStats, BreakdownCategory } from '../types';
import { engineStore } from './engineStore';
import { buildStore } from './buildStore';

export const analyticsStore = {
  getStats: (): EngineStats[] => {
    const engines = engineStore.getAllActive();
    const reports = engineStore.getAllReports();
    const builds = buildStore.getBuilds();

    return engines.map(engine => {
      const engineReports = reports.filter(r => r.engineId === engine.id);
      const engineBuilds = builds.filter(b => b.engineId === engine.id);
      
      // Расчет надежности
      const failureReports = engineReports.filter(r => r.hasBreakdowns);
      const failureRate = engineReports.length > 0 
        ? (failureReports.length / engineReports.length) * 100 
        : 25; // Базовое допущение

      const avgMileage = failureReports.length > 0
        ? failureReports.reduce((acc, r) => acc + r.mileage, 0) / failureReports.length
        : 150; // Базовый ресурс

      // Поиск самой частой причины
      const failureCounts: Record<string, number> = {};
      failureReports.forEach(r => {
        r.breakdownCategories.forEach(cat => {
          failureCounts[cat] = (failureCounts[cat] || 0) + 1;
        });
      });

      const topReason = Object.entries(failureCounts)
        .sort(([, a], [, b]) => b - a)[0]?.[0] as BreakdownCategory || 'Нет данных';

      // Score расчета
      const reliabilityScore = Math.max(0, 100 - failureRate + (avgMileage / 10));
      const popularityScore = (engineReports.length * 2) + (engineBuilds.length * 5) + (engine.views || 0);

      return {
        engineId: engine.id,
        engineName: engine.name,
        brand: engine.brand,
        ownersCount: engineReports.length,
        buildsCount: engineBuilds.length,
        avgMileageToFailure: Math.round(avgMileage),
        failureRate: Math.round(failureRate),
        topFailureReason: topReason,
        reliabilityScore: Math.round(Math.min(100, reliabilityScore)),
        popularityScore: Math.round(popularityScore)
      };
    });
  },

  getTopByPopularity: (limit = 10) => {
    return analyticsStore.getStats()
      .sort((a, b) => b.popularityScore - a.popularityScore)
      .slice(0, limit);
  },

  getTopByReliability: (limit = 10) => {
    return analyticsStore.getStats()
      .sort((a, b) => b.reliabilityScore - a.reliabilityScore)
      .slice(0, limit);
  },

  getMostProblematic: (limit = 10) => {
    return analyticsStore.getStats()
      .filter(s => s.ownersCount > 0)
      .sort((a, b) => b.failureRate - a.failureRate)
      .slice(0, limit);
  }
};
