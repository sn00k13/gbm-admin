import { 
    collection, doc, setDoc, getDoc, updateDoc,
    getDocs, query, where, addDoc 
  } from 'firebase/firestore';
  import { db } from './firebase';
  
  // ================= USERS =================
  export const createUserProfile = async (userId, { name, email, phone }) => {
    await setDoc(doc(db, 'users', userId), {
      name,
      email,
      phone,
      addresses: array[
        {
          nickname: string,
          street: string,
          city: string,
          state: string,
          zipCode: string,
          isDefault: boolean
        }
      ],
      createdAt: new Date()
    });
  };
  
  export const getUserProfile = async (userId) => {
    const snapshot = await getDoc(doc(db, 'users', userId));
    return snapshot.exists() ? snapshot.data() : null;
  };
  
  // ================= RESTAURANTS =================
  export const fetchRestaurants = async (location = 'Owerri') => {
    const q = query(
      collection(db, 'restaurants'),
      where('location', '==', location)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  };
  
  export const fetchMeals = async (restaurantId = null) => {
    let q;
    if (restaurantId) {
      q = query(
        collection(db, 'meals'),
        where('restaurantId', '==', restaurantId)
      );
    } else {
      q = query(collection(db, 'meals'));
    }
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  };
  
  export const fetchRestaurantDetails = async (restaurantId) => {
    const docRef = doc(db, 'restaurants', restaurantId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error('Restaurant not found');
    }
  };
  // ================= ORDERS =================
  export const createOrder = async (userId, items, total) => {
    const orderRef = await addDoc(collection(db, 'orders'), {
      userId,
      items,
      total,
      status: 'pending',
      createdAt: new Date()
    });
    return orderRef.id;
  };

  

  // ================= ADDRESSES =================
export const addUserAddress = async (userId, addressData) => {
  // If setting as default, first remove default from others
  if (addressData.isDefault) {
    await updateDoc(doc(db, 'users', userId), {
      addresses: arrayUnion({ ...addressData, isDefault: true }),
      // Set all other addresses to non-default
    });
  } else {
    await updateDoc(doc(db, 'users', userId), {
      addresses: arrayUnion(addressData)
    });
  }
};

export const updateUserAddress = async (userId, oldAddress, newAddress) => {
  await updateDoc(doc(db, 'users', userId), {
    addresses: arrayRemove(oldAddress)
  });
  await addUserAddress(userId, newAddress);
};

export const setDefaultAddress = async (userId, addressId) => {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  const addresses = userSnap.data().addresses;
  
  const updatedAddresses = addresses.map(addr => ({
    ...addr,
    isDefault: addr.id === addressId
  }));
  
  await updateDoc(userRef, { addresses: updatedAddresses });
};

  // ================= AGENTS =================

/**
 * Creates an agent profile in Firestore.
 * @param {string} agentId - The unique ID for the agent (document ID).
 * @param {{ name: string, email: string, phone: string, isVerified?: boolean }} data - Agent data.
 * @returns {Promise<void>}
 */
export const createAgentProfile = async (agentId, { name, email, phone, isVerified = false }) => {
  await setDoc(doc(db, 'agents', agentId), {
    name,
    email,
    phone,
    isVerified,
    createdAt: new Date(),
  });
};
