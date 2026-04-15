import { SignOutButton } from '@/components/sign-out-button';
import { View , Text, TouchableOpacity, FlatList, RefreshControl } from 'react-native';
import { Image } from 'react-native';
import { Alert } from 'react-native';
import { SignedIn, SignedOut, useSession, useUser } from '@clerk/clerk-expo';
import { useTransactions } from '../../hooks/useTransaction';
import { useEffect, useState } from 'react';
import PageLoader from '../../components/PageLoader';
import { styles } from '../../assets/styles/home.styles';
import { Link, useRouter } from "expo-router";
import { Ionicons} from "@expo/vector-icons";
import { BalanceCard } from '../../components/BalanceCard';
import { TransactionItem } from '../../components/TransactionItem';
import  NoTransactionsFound  from '../../components/NoTransactionsFound';

export default function Page() {
  const { user } = useUser();
  const router = useRouter();
  const [refreshing , setRefreshing] = useState(false);
// user.id given by clerk
  const { transactions , summary , isloading, loadData, deleteTransactions} = useTransactions(user.id);
// function to refresh list of transactions
const onRefresh = async () => {
  setRefreshing(true)
  await loadData();
  setRefreshing(false);
}



useEffect(() =>{
    loadData();

},[loadData]);
const handleDelete = (id) => {
  Alert.alert("Delete Transaction", "Are you sure you want to delete this transaction?", [
        { text: "Cancel", style: "cancel" },
        { text: "Deleter", style: "destructive", onPress: () => deleteTransactions(id) },
      ]);

}

if(isloading && !refreshing) return <PageLoader />;


  return (
    <View style={styles.container}>
      <View  style={styles.content}>
        {/* header */}
        <View style={styles.header}>
          {/* left */}
          <View style={styles.headerLeft}>
              <Image
                source={require("../../assets/images/logoedited.png")} 
                style={styles.headerLogo}
                resizeMode="contain" />
                <View style={styles.welcomeContainer}>
                  <Text style={styles.welcomeText}>Welcome</Text>
                  <Text style={styles.usernameText}>{user?.emailAddresses[0]?.emailAddress.split("@")[0]}</Text>
                </View>
              
          </View>
          {/* right  */}
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.addButton} onPress={() => router.push("/create")} >
              <Ionicons name="add" size={20} color="#FFF" />
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
            <SignOutButton />

          </View>

        </View>
          {/* balance card */}    
          <BalanceCard summary={summary} />
          <View style={styles.transactionsHeaderContainer}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
          </View>
        
      </View>
        {/* transaction with flat list for libery flat list render only in screen transaction that will boost performence */}
        <FlatList
        style={styles.transactionsList}
        contentContainerStyle={styles.transactionsListContent}
        data={transactions}
        ListEmptyComponent={<NoTransactionsFound />}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={({item}) => 
          <TransactionItem item={item} onDelete={handleDelete}/>}
        />

    </View>

  );

}
