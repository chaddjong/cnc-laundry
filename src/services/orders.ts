import { db } from '@/lib/firebase/firebase';
import {
  collection,
  addDoc,
  Timestamp,
  onSnapshot,
  doc,
  updateDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';

export interface OrderData {
  name: string;
  phone: string;
  address: string;
  serviceType: string;
  deliveryDate: Date | null;
  deliveryTime: string;
  orderId: string;
  status: string; // default: "pending"
  note: string; // default: ""
  imageUrl: string; // default: ""
  beratLaundry: number;
  pembayaran?: 'qris' | 'tunai' | 'transfer';
}

// =====================
// CREATE ORDER
// =====================
export async function createOrder(data: OrderData) {
  const docRef = await addDoc(collection(db, 'orders'), {
    ...data,

    status: data.status ?? 'pending',
    note: data.note ?? '',
    imageUrl: data.imageUrl ?? '',
    beratLaundry: data.beratLaundry ?? null, // <<< NEW

    createdAt: Timestamp.now(),
  });

  return docRef.id;
}

// =====================
// REALTIME LISTENER (Admin)
// =====================
export const listenOrders = (callback: (orders: any[]) => void) => {
  return onSnapshot(collection(db, 'orders'), (snapshot) => {
    const data = snapshot.docs.map((doc) => {
      const d = doc.data();

      return {
        id: doc.id,
        ...d,

        note: d.note ?? '',
        imageUrl: d.imageUrl ?? '',
        status: d.status ?? 'pending',
        beratLaundry: d.beratLaundry ?? null, // <<< NEW

        deliveryDate:
          d.deliveryDate instanceof Timestamp
            ? d.deliveryDate.toDate().toISOString().split('T')[0]
            : d.deliveryDate,

        createdAt:
          d.createdAt instanceof Timestamp
            ? d.createdAt.toDate().toISOString()
            : d.createdAt,
      };
    });

    callback(data);
  });
};

// =====================
// UPDATE ORDER (Admin)
// =====================
export async function updateOrder(
  orderId: string,
  data: Partial<OrderData> & Record<string, any>
) {
  const ref = doc(db, 'orders', orderId);

  // HAPUS field undefined sebelum update
  const cleaned: Record<string, any> = {};

  Object.keys(data).forEach((key) => {
    const value = data[key];
    if (value !== undefined) {
      cleaned[key] = value;
    }
  });

  await updateDoc(ref, cleaned);
}

// =====================
// GET SINGLE ORDER
// =====================
export async function getOrderById(orderId: string) {
  const q = query(collection(db, 'orders'), where('orderId', '==', orderId));

  const snapshot = await getDocs(q);

  if (snapshot.empty) return null;

  const docSnap = snapshot.docs[0];
  const d = docSnap.data();

  return {
    id: docSnap.id,
    ...d,

    note: d.note ?? '',
    price: d.price ?? '',
    imageUrl: d.imageUrl ?? '',
    status: d.status ?? 'pending',
    beratLaundry: d.beratLaundry ?? null, // <<< NEW

    deliveryDate:
      d.deliveryDate instanceof Timestamp
        ? d.deliveryDate.toDate().toISOString().split('T')[0]
        : d.deliveryDate,

    createdAt:
      d.createdAt instanceof Timestamp
        ? d.createdAt.toDate().toISOString()
        : d.createdAt,
  };
}
