let isUnderMaintenance = false;

export const getMaintenanceStatus = () => isUnderMaintenance;

export const scheduleJobWithMaintenance = async (jobFunction) => {
    try {
        isUnderMaintenance = true;
        await jobFunction();
    } finally {
        isUnderMaintenance = false;
    }
};