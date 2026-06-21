import { apiFetch } from './api';

export const inventoryService = {
  // Blood Inventory
  async createInventory(hospitalId, bloodType, initialQuantity, minimumThreshold) {
    return apiFetch(`/api/inventory?hospitalId=${hospitalId}&bloodType=${bloodType}&initialQuantity=${initialQuantity}&minimumThreshold=${minimumThreshold}`, {
      method: 'POST',
    });
  },

  async getInventory(id) {
    return apiFetch(`/api/inventory/${id}`);
  },

  async getInventoryByHospital(hospitalId) {
    return apiFetch(`/api/inventory/hospital/${hospitalId}`);
  },

  async getInventoryByBloodType(hospitalId, bloodType) {
    return apiFetch(`/api/inventory/hospital/${hospitalId}/blood-type/${bloodType}`);
  },

  async getLowStockInventory(hospitalId) {
    return apiFetch(`/api/inventory/hospital/${hospitalId}/low-stock`);
  },

  async getExpiredInventory() {
    return apiFetch('/api/inventory/expired');
  },

  async updateQuantity(id, quantityChange) {
    return apiFetch(`/api/inventory/${id}/update-quantity?quantityChange=${quantityChange}`, {
      method: 'PUT',
    });
  },

  async getTotalQuantity(hospitalId, bloodType) {
    return apiFetch(`/api/inventory/hospital/${hospitalId}/total/blood-type/${bloodType}`);
  },

  // Blood Units
  async createBloodUnit(donationId, hospitalId, bloodType, quantityMl) {
    return apiFetch(`/api/blood-units?donationId=${donationId}&hospitalId=${hospitalId}&bloodType=${bloodType}&quantityMl=${quantityMl}`, {
      method: 'POST',
    });
  },

  async getBloodUnit(id) {
    return apiFetch(`/api/blood-units/${id}`);
  },

  async getBloodUnitsByDonation(donationId) {
    return apiFetch(`/api/blood-units/donation/${donationId}`);
  },

  async getBloodUnitsByHospital(hospitalId) {
    return apiFetch(`/api/blood-units/hospital/${hospitalId}`);
  },

  async getAvailableUnits(hospitalId) {
    return apiFetch(`/api/blood-units/hospital/${hospitalId}/available`);
  },

  async getAvailableUnitsByBloodType(hospitalId, bloodType) {
    return apiFetch(`/api/blood-units/hospital/${hospitalId}/available/blood-type/${bloodType}`);
  },

  async updateUnitStatus(id, status) {
    return apiFetch(`/api/blood-units/${id}/status?status=${status}`, {
      method: 'PUT',
    });
  },

  async updateTestingResults(id, results) {
    return apiFetch(`/api/blood-units/${id}/testing-results`, {
      method: 'PUT',
      body: JSON.stringify(results),
    });
  },

  async getExpiringUnits() {
    return apiFetch('/api/blood-units/expiring');
  },

  async countAvailableUnits(hospitalId, bloodType) {
    return apiFetch(`/api/blood-units/hospital/${hospitalId}/count/blood-type/${bloodType}`);
  },
};
