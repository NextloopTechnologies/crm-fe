export const getChangedFields = (
    original: Record<string, any>,
    updated: Record<string, any>
  ): Record<string, any> => {
    const changes: Record<string, any> = {};
  
    Object.keys(updated).forEach((key) => {
      if (
        typeof updated[key] === "object" &&
        updated[key] !== null &&
        !Array.isArray(updated[key])
      ) {
        const nestedChanges = getChangedFields(
          original?.[key] || {},
          updated[key]
        );
  
        if (Object.keys(nestedChanges).length > 0) {
          changes[key] = nestedChanges;
        }
      } else if (updated[key] !== original?.[key]) {
        changes[key] = updated[key];
      }
    });
  
    return changes;
  };