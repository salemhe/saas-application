// src/utils/facebook.ts

interface AdAccount {
   id: string;
   name: string;
   businessName?: string;
   currency: string;
   isActive: boolean;
   rawId: string;
 }
 
 interface AdAccountsResponse {
   success: boolean;
   accounts: AdAccount[];
   total: number;
   error?: string;
 }
 
 export const fetchUserAdAccounts = async (accessToken: string): Promise<AdAccountsResponse> => {
   try {
     const response = await fetch(
       `https://graph.facebook.com/v18.0/me/adaccounts?fields=name,id,account_status,business_name,currency&access_token=${accessToken}`
     );
 
     if (!response.ok) {
       const error = await response.json();
       throw new Error(error.error?.message || 'Failed to fetch ad accounts');
     }
 
     const data = await response.json();
     
     const accounts = data.data.map((account: { id: string; name: any; business_name: any; currency: any; account_status: number; }) => ({
       id: account.id.replace('act_', ''),
       name: account.name,
       businessName: account.business_name,
       currency: account.currency,
       isActive: account.account_status === 1,
       rawId: account.id
     }));
 
     return {
       success: true,
       accounts: accounts.filter((account: { isActive: any; }) => account.isActive),
       total: accounts.length
     };
   } catch (error: any) {
     console.error('Error fetching ad accounts:', error);
     return {
       success: false,
       error: error.message,
       accounts: [],
       total: 0
     };
   }
 };