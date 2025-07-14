const getIconForCategory = (category: string): string => {
  const map: Record<string, string> = {
    Food: 'coffee',
    'Food & Dining': 'coffee',
    Travel: 'car',
    'Travel & Transportation': 'car',
    Shopping: 'shopping-bag',
    'Shopping & Personal Items': 'shopping-bag',
    Bills: 'phone',
    'Bills & Utilities': 'phone',
    Health: 'heart',
    'Health & Wellness': 'heart',
  };
  return map[category] || 'tag'; // Default icon if category not found
};


export const getOverviewIconForCategory = (category: string): string => {
  const map: Record<string, string> = {
    Food: 'coffee',
    'Food & Dining': 'coffee',
    Travel: 'car',
    'Travel & Transportation': 'car',
    Shopping: 'shopping-bag',
    'Shopping & Personal Items': 'shopping-bag',
    Bills: 'phone',
    'Bills & Utilities': 'phone',
    Health: 'heart',
    'Health & Wellness': 'heart',
  };
  return map[category] || 'tag'; // Default icon if category not found
};



export default getIconForCategory;
