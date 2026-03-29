// react custom hook file 
import { useCallback, useState } from "react";
import { Alert } from "react-native";
import { API_URL } from "../constants/api";

// api = https://spendwise-api-2.onrender.com



export const useTransactions = ( user_id ) => {
    const [transactions , setTransactions] = useState([]);
    const[summary , setSummary] = useState({
        balance: 0,
        income: 0,
        expense: 0,

    });
    const [ isloading , setIsloading ] = useState(true);
    // usecallback is used for performance reasons it will memoize the function
    const fetchTransactions = useCallback(
        async () => {
        try{
            const response = await fetch(`${ API_URL}/api/transactions/${user_id}`);
            console.log(user_id)
            const data = await response.json();
            
            
            setTransactions(data);
        }catch(error){
            console.error("Error fetching transactions",error);
        };
        },[user_id]);

         const fetchSummary = useCallback(
        async () => {
        try{
            const response = await fetch(`${ API_URL}/api/transactions/summary/${user_id}`);
            const data = await response.json();
            setSummary(data);
        }catch(error){
            console.error("Error fetching transactions",error);
        };
        },[user_id]);

        const loadData = useCallback(
        async () => {
            
            if (!user_id) return ;
            setIsloading(true);
            try{
                //to run both in the same time
               await Promise.all([fetchTransactions(), fetchSummary()]);

            }catch(error){
                console.error("Error loading data",error);
            }finally{
                setIsloading(false);
            }

        },[fetchTransactions, fetchSummary, user_id]);


        const deleteTransactions = async( id ) => {
            try{
                const response = await fetch(`${ API_URL}/api/transactions/${id}` , {method: "DELETE"});
                if (!response.ok) throw new Error("Faild to delete transaction");
                //REFRESH data after deletion
                loadData();
                Alert.alert("Success","Transation deleted successfully");

            }catch(error){
                console.error("Error deleting transaction",error);
                Alert.alert("Error",error.message);

            }
        };



    return { transactions , summary , isloading, loadData, deleteTransactions};
};