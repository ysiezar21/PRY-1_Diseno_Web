// src/services/userService.ts
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

// ============ TIPOS ============

export interface MetodoPago {
  añoExp: string;
  cvv: string;
  mesExp: string;
  numeroTarjeta: string;
  titular: string;
}

export interface ProductoPedido {
  cantidad: number;
  categoria: string;
  nombre: string;
  precio?: number;
}

export interface Pedido {
  productos: { [key: string]: ProductoPedido };
  total: number;
  fecha?: any;
  estado?: string;
}

export interface UserProfile {
  direccion: string;
  email: string;
  nombre: string;
  telefono: string;
  metodosPago: { [key: string]: MetodoPago };
  pedidos: { [key: string]: Pedido };
  createdAt?: any;
  updatedAt?: any;
}

// ============ FUNCIONES PRINCIPALES ============

// 1. CREAR PERFIL DE USUARIO (al registrarse)
export const createUserProfile = async (
  userId: string, 
  email: string, 
  datos: {
    nombre: string;
    telefono: string;
    direccion: string;
  }
) => {
  try {
    // Crear documento con ID = userId (UID del usuario)
    const userRef = doc(db, "usuarios", userId);
    
    const userProfile: UserProfile = {
      direccion: datos.direccion,
      email: email,
      nombre: datos.nombre,
      telefono: datos.telefono,
      metodosPago: {},
      pedidos: {},
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    await setDoc(userRef, userProfile);
    console.log("✅ Perfil creado en Firestore para:", email);
    return userProfile;
    
  } catch (error) {
    console.error("❌ Error creando perfil:", error);
    throw error;
  }
};

// 2. OBTENER PERFIL COMPLETO
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const userRef = doc(db, "usuarios", userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return userSnap.data() as UserProfile;
    }
    return null;
    
  } catch (error) {
    console.error("❌ Error obteniendo perfil:", error);
    throw error;
  }
};

// 3. ACTUALIZAR DATOS PERSONALES
export const updateUserData = async (
  userId: string,
  updates: {
    direccion?: string;
    nombre?: string;
    telefono?: string;
  }
) => {
  try {
    const userRef = doc(db, "usuarios", userId);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
    console.log("✅ Datos actualizados para:", userId);
    
  } catch (error) {
    console.error("❌ Error actualizando datos:", error);
    throw error;
  }
};

// 4. AGREGAR MÉTODO DE PAGO
export const addPaymentMethod = async (
  userId: string,
  metodoId: string,
  metodo: MetodoPago
) => {
  try {
    const userRef = doc(db, "usuarios", userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      throw new Error("Usuario no encontrado");
    }
    
    const userData = userSnap.data() as UserProfile;
    const metodosActuales = userData.metodosPago || {};
    
    metodosActuales[metodoId] = metodo;
    
    await updateDoc(userRef, {
      metodosPago: metodosActuales,
      updatedAt: serverTimestamp()
    });
    
    console.log(`✅ Método ${metodoId} agregado`);
    return metodo;
    
  } catch (error) {
    console.error("❌ Error agregando método:", error);
    throw error;
  }
};

// 5. ELIMINAR MÉTODO DE PAGO
export const removePaymentMethod = async (userId: string, metodoId: string) => {
  try {
    const userRef = doc(db, "usuarios", userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) return;
    
    const userData = userSnap.data() as UserProfile;
    const metodosActuales = { ...userData.metodosPago };
    
    delete metodosActuales[metodoId];
    
    await updateDoc(userRef, {
      metodosPago: metodosActuales,
      updatedAt: serverTimestamp()
    });
    
    console.log(`✅ Método ${metodoId} eliminado`);
    
  } catch (error) {
    console.error("❌ Error eliminando método:", error);
    throw error;
  }
};

// 6. AGREGAR NUEVO PEDIDO
export const addNewOrder = async (
  userId: string,
  pedidoId: string,
  pedido: Pedido
) => {
  try {
    const userRef = doc(db, "usuarios", userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      throw new Error("Usuario no encontrado");
    }
    
    const userData = userSnap.data() as UserProfile;
    const pedidosActuales = userData.pedidos || {};
    
    const pedidoCompleto: Pedido = {
      ...pedido,
      fecha: pedido.fecha || serverTimestamp(),
      estado: pedido.estado || "pendiente"
    };
    
    pedidosActuales[pedidoId] = pedidoCompleto;
    
    await updateDoc(userRef, {
      pedidos: pedidosActuales,
      updatedAt: serverTimestamp()
    });
    
    console.log(`✅ Pedido ${pedidoId} agregado`);
    return pedidoCompleto;
    
  } catch (error) {
    console.error("❌ Error agregando pedido:", error);
    throw error;
  }
};

// 7. AGREGAR PRODUCTO A PEDIDO EXISTENTE
export const addProductToOrder = async (
  userId: string,
  pedidoId: string,
  productoId: string,
  producto: ProductoPedido
) => {
  try {
    const userRef = doc(db, "usuarios", userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      throw new Error("Usuario no encontrado");
    }
    
    const userData = userSnap.data() as UserProfile;
    
    if (!userData.pedidos || !userData.pedidos[pedidoId]) {
      throw new Error("Pedido no encontrado");
    }
    
    const pedido = { ...userData.pedidos[pedidoId] };
    const productosActuales = pedido.productos || {};
    
    productosActuales[productoId] = producto;
    
    if (producto.precio) {
      let nuevoTotal = producto.precio * producto.cantidad;
      
      Object.values(productosActuales).forEach(p => {
        if (p !== producto && p.precio) {
          nuevoTotal += p.precio * p.cantidad;
        }
      });
      
      pedido.total = nuevoTotal;
    }
    
    pedido.productos = productosActuales;
    
    await updateDoc(userRef, {
      [`pedidos.${pedidoId}`]: pedido,
      updatedAt: serverTimestamp()
    });
    
    console.log(`✅ Producto ${productoId} agregado al pedido ${pedidoId}`);
    
  } catch (error) {
    console.error("❌ Error agregando producto:", error);
    throw error;
  }
};

// 8. ACTUALIZAR ESTADO DE PEDIDO
export const updateOrderStatus = async (
  userId: string,
  pedidoId: string,
  nuevoEstado: string
) => {
  try {
    const userRef = doc(db, "usuarios", userId);
    
    await updateDoc(userRef, {
      [`pedidos.${pedidoId}.estado`]: nuevoEstado,
      updatedAt: serverTimestamp()
    });
    
    console.log(`✅ Pedido ${pedidoId} actualizado a: ${nuevoEstado}`);
    
  } catch (error) {
    console.error("❌ Error actualizando pedido:", error);
    throw error;
  }
};

// 9. OBTENER TODOS LOS PEDIDOS (convertidos a array)
export const getUserOrdersArray = async (userId: string) => {
  try {
    const profile = await getUserProfile(userId);
    if (!profile || !profile.pedidos) return [];
    
    return Object.entries(profile.pedidos).map(([id, datos]) => ({
      id,
      ...datos,
      productosArray: datos.productos 
        ? Object.entries(datos.productos).map(([prodId, prod]) => ({
            id: prodId,
            ...prod
          }))
        : []
    }));
    
  } catch (error) {
    console.error("❌ Error obteniendo pedidos:", error);
    throw error;
  }
};

// 10. OBTENER TODOS LOS MÉTODOS DE PAGO (convertidos a array)
export const getUserPaymentMethodsArray = async (userId: string) => {
  try {
    const profile = await getUserProfile(userId);
    if (!profile || !profile.metodosPago) return [];
    
    return Object.entries(profile.metodosPago).map(([id, datos]) => ({
      id,
      ...datos
    }));
    
  } catch (error) {
    console.error("❌ Error obteniendo métodos:", error);
    throw error;
  }
};

// 11. OBTENER TOTAL DE PEDIDOS
export const getTotalOrders = async (userId: string) => {
  try {
    const profile = await getUserProfile(userId);
    if (!profile || !profile.pedidos) return 0;
    return Object.keys(profile.pedidos).length;
  } catch (error) {
    console.error("❌ Error obteniendo total de pedidos:", error);
    return 0;
  }
};

// 12. OBTENER TOTAL GASTADO
export const getTotalSpent = async (userId: string) => {
  try {
    const profile = await getUserProfile(userId);
    if (!profile || !profile.pedidos) return 0;
    
    return Object.values(profile.pedidos).reduce((total, pedido) => {
      return total + (pedido.total || 0);
    }, 0);
    
  } catch (error) {
    console.error("❌ Error obteniendo total gastado:", error);
    return 0;
  }
};



// 13. FUNCIÓN PARA CREAR PEDIDO DESDE CARRITO
export const createOrderFromCart = async (
  userId: string,
  items: Array<{
    id: string;
    nombre: string;
    categoria: string;
    cantidad: number;
    precio: number;
    imagen?: string;
    descuento?: number;
  }>,
  total: number,
) => {
  try {
    const userRef = doc(db, "usuarios", userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      throw new Error("Usuario no encontrado");
    }
    
    const userData = userSnap.data() as UserProfile;
    const pedidosActuales = userData.pedidos || {};
    
    // Crear ID único para el pedido
    const pedidoId = `pedido_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Convertir items array a mapa de productos
    const productosMap: { [key: string]: ProductoPedido } = {};
    
    items.forEach((item, index) => {
      const productoId = `producto_${index + 1}`;
      productosMap[productoId] = {
        nombre: item.nombre,
        categoria: item.categoria || "General",
        cantidad: item.cantidad,
        precio: item.precio,
      };
    });
    
    // Crear el pedido completo
    const nuevoPedido: Pedido = {
      productos: productosMap,
      total: total,
      fecha: serverTimestamp(),
    };
    
    // Agregar al mapa de pedidos
    pedidosActuales[pedidoId] = nuevoPedido;
    
    // Actualizar en Firestore
    await updateDoc(userRef, {
      pedidos: pedidosActuales,
      updatedAt: serverTimestamp()
    });
    
    console.log(`✅ Pedido ${pedidoId} creado con ${items.length} productos`);
    return { pedidoId, ...nuevoPedido };
    
  } catch (error) {
    console.error("❌ Error creando pedido:", error);
    throw error;
  }
};

// 14. FUNCIÓN PARA PROCESAR COMPRA COMPLETA
export const processPurchase = async (
  userId: string,
  purchaseData: {
    items: Array<{
      id: string;
      nombre: string;
      categoria: string;
      cantidad: number;
      precio: number;
      imagen?: string;
      descuento?: number;
    }>;
    total: number;
    direccionEnvio: string;
    metodoPago: {
      titular: string;
      numeroTarjeta: string;
      fechaExpiracion: string;
      cvv: string;
      tipo: string;
    };
    metodoPagoId?: string;
  }
) => {
  try {
    console.log("🛒 Procesando compra para usuario:", userId);
    
    // 1. Guardar método de pago
    let metodoPagoId = purchaseData.metodoPagoId;
    
    if (!metodoPagoId) {
      const metodoId = `metodo_${Date.now()}`;
      const [mesExp, añoExp] = purchaseData.metodoPago.fechaExpiracion.split('/');
      
      const metodoPago: MetodoPago = {
        titular: purchaseData.metodoPago.titular,
        numeroTarjeta: purchaseData.metodoPago.numeroTarjeta,
        mesExp: mesExp || "",
        añoExp: añoExp || "",
        cvv: purchaseData.metodoPago.cvv
      };
      
      await addPaymentMethod(userId, metodoId, metodoPago);
      metodoPagoId = metodoId;
    }
    
    // 2. Crear pedido
    const pedido = await createOrderFromCart(
      userId,
      purchaseData.items,
      purchaseData.total,
    );
    
    // 3. Retornar resultado
    return {
      success: true,
      pedidoId: pedido.pedidoId,
      metodoPagoId: metodoPagoId,
      total: purchaseData.total,
      itemsCount: purchaseData.items.length
    };
    
  } catch (error) {
    console.error("❌ Error procesando compra:", error);
    throw error;
  }
};