import { getAuth } from "firebase/auth";
import { db, storage } from "../services/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  orderBy,
  Timestamp,
  setDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// hooks
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

export const useFirestore = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);

  const auth = getAuth();
  const { currentUser: user } = useAuth();
  //cleanup
  const [cancelled, setCancelled] = useState(false);

  function checkIfCancelled() {
    if (cancelled) return;
  }

  async function getDocsQuery(q) {
    let collect = [];
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      // console.log(doc.id, " => ", doc.data());
      collect.push({ ...doc.data(), id: doc.id });
    });

    return collect;
  }

  function validate(mode) {
    if (mode === "start") {
      checkIfCancelled();

      setLoading(true);
      setError(null);
    } else if (mode === "end") {
      setLoading(false);
    }
  }

  // functions - sets
  const setDocument = async (collect = "", data = {}) => {
    validate("start");
    let systemErrorMessage;

    try {
      const res = await addDoc(collection(db, collect), data);

      //se a coleção for congregacoes, fazer um update no documento com o id do documento
      if (collect === "congregacoes") {
        const dat = { id: res.id, ...data };
        await updateDoc(doc(db, collect, res.id), dat);
      }

      validate("end");
      return res;
    } catch (error) {
      console.log(error.messeger);
      console.log(typeof error.messeger);

      systemErrorMessage = "Ocorreu um erro, por favor tenta mais tarde.";

      setError(systemErrorMessage);
    }
    validate("end");
  };

  const setDocWithId = async ({ collect, id, data }) => {
    validate("start");
    let systemErrorMessage;

    try {
      const res = await setDoc(doc(db, collect, id), data);
      return res;
    } catch (error) {
      systemErrorMessage = "Ocorreu um erro, por favor tenta mais tarde.";
      setError(systemErrorMessage);
    }
    validate("end");
  };

  const setTerritories = async (data = {}, file) => {
    const collect = "territorios";
    validate("start");

    const res = await addDoc(collection(db, collect), {
      ...data,
      cid: user.uid,
    });

    // upload do map em data para o storage
    const mapRef = ref(storage, `territorios/${res.id}/mapa.png`);
    await uploadBytes(mapRef, file).then((snapshot) => {
      // Get the download URL
      getDownloadURL(mapRef).then(async (url) => {
        // Update do territorio com o novo map
        const newTerritorio = {
          id: res.id,
          map: url,
          createdAt: Timestamp.now(),
          requests: 0,
        };

        await updateDoc(doc(db, collect, res.id), newTerritorio);

        // refresh page
        setTimeout(() => {
          window.location.reload();
        }, 2000);

        validate("end");
        return res;
      });
    });
  };

  // functions - update
  const updateDocument = async (collect = "", documentId = "", data = {}) => {
    validate("start");
    let systemErrorMessage;

    const res = await updateDoc(doc(db, collect, documentId), data);
    validate("end");

    validate("end");
    return res;
  };

  const updateTerritories = async (documentId = "", data = {}, file = null) => {
    validate("start");
    const collect = "territorios";

    if (file) {
      // upload do map em data para o storage
      const mapRef = ref(storage, `territorios/${documentId}/mapa.png`);
      await uploadBytes(mapRef, file).then((snapshot) => {
        // Get the download URL
        getDownloadURL(mapRef).then(async (url) => {
          // Update do territorio com o novo map
          const newTerritorio = {
            ...data,
            map: url,
            updatedAt: Timestamp.now(),
          };

          await updateDoc(doc(db, collect, documentId), newTerritorio);

          // refresh page
          setTimeout(() => {
            validate("end");
            window.location.reload();
          }, 100);
          return;
        });
      });
    }

    const newTerritorio = {
      ...data,
      updatedAt: Timestamp.now(),
    };

    await updateDoc(doc(db, collect, documentId), newTerritorio);

    // refresh page
    setTimeout(() => {
      validate("end");
      window.location.reload();
    }, 100);
  };

  // functions - gets
  const getDocId = async (collect, documentId) => {
    validate("start");
    console.log("getDocId is running");

    const docRef = doc(db, collect, documentId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      validate("end");
      return docSnap.data();
    } else {
      setError("Documento não encontrado.");
    }

    validate("end");
  };

  const getDocWhere = async ({
    collect = "",
    whr = { attr: "", comp: "", value: "" },
    id = false,
  }) => {
    //where {attr, comp, value}
    validate("start");
    console.log("getDocWhere is running");

    try {
      const q = query(
        collection(db, collect),
        where(whr.attr, whr.comp, whr.value)
      );

      const res = await getDocsQuery(q);

      validate("end");
      if (id) {
        return res[0].id;
      }
      return res[0];
    } catch (error) {
      console.log(error.messeger);
      console.log(typeof error.messeger);

      let systemErrorMessage;

      /* if (error.message.includes("email-already")) {
      systemErrorMessage = "E-mail já cadastrado.";
    } else {
      systemErrorMessage = "Ocorreu um erro, por favor tenta mais tarde.";
    } */
      systemErrorMessage = "Ocorreu um erro, por favor tenta mais tarde.";

      setError(systemErrorMessage);
      validate("end");
    }
  };

  const getCollection = async (collect, ord = { attr: "", dir: "" }) => {
    validate("start");
    console.log("getCollection is running");

    const q = query(
      collection(db, collect),
      ord.attr && orderBy(ord.attr, ord.dir)
    );

    const res = await getDocsQuery(q);

    validate("end");
    return res;
  };

  const getCollectionWhere = async (
    collect,
    whr = { attr: "", comp: "", value: "" },
    ord = { attr: "", dir: "" }
  ) => {
    //where {attr, comp, value}
    validate("start");
    console.log("getCollectionWhere is running");


    try {
      const q = query(
        collection(db, collect),
        where(whr.attr, whr.comp, whr.value)
      );

      const res = await getDocsQuery(q);

      validate("end");
      return res;
    } catch (error) {
      console.log(error.messeger);
      console.log(typeof error.messeger);

      let systemErrorMessage;

      /* if (error.message.includes("email-already")) {
      systemErrorMessage = "E-mail já cadastrado.";
    } else {
      systemErrorMessage = "Ocorreu um erro, por favor tenta mais tarde.";
    } */
      systemErrorMessage = "Ocorreu um erro, por favor tenta mais tarde.";

      setError(systemErrorMessage);
      validate("end");
    }
  };

  const getTerritories = async (
    ord = { attr: "", dir: "" },
    congregacaoId = false
  ) => {
    validate("start");
    console.log("getTerritories is running");

    const collect = "territorios";
    const cid = congregacaoId !== undefined ? congregacaoId : user.uid;

    let q = undefined;

    if (ord.attr) {
      q = query(
        collection(db, collect),
        cid && where("cid", "==", cid),
        orderBy(ord.attr, ord.dir)
      );
    } else {
      q = query(collection(db, collect), cid && where("cid", "==", cid));
    }

    const res = await getDocsQuery(q);

    validate("end");
    return res;
  };

  const getTerritoriesWhere = async ({
    whr = { attr: "", comp: "", value: "" },
    ord = { attr: "", dir: "" },
    isAdmin = false,
    congregacaoId = "",
  }) => {
    validate("start");
    console.log("getTerritoriesWhere is running");

    const collect = "territorios";
    const cid = user.uid;

    // console.log(cid);

    let q = undefined;

    if (ord.attr) {
      q = query(
        collection(db, collect),
        where(whr.attr, whr.comp, whr.value),
        cid && where("cid", "==", cid),
        orderBy(ord.attr, ord.dir)
      );
    } else {
      q = query(
        collection(db, collect),
        where(whr.attr, whr.comp, whr.value),
        cid !== false ? where("cid", "==", cid) : ""
      );
    }

    const res = await getDocsQuery(q);

    validate("end");
    return res;
  };

  // function - delete

  const deleteTerritory = async (documentId = "") => {
    validate("start");
    const collect = "territorios";
    let systemErrorMessage;

    try {
      await deleteDoc(doc(db, collect, documentId));
      validate("end");
      // refresh page
      setTimeout(() => {
        window.location.reload();
      }, 200);
    } catch (error) {
      console.log(error.messeger);
      console.log(typeof error.messeger);

      systemErrorMessage = "Ocorreu um erro, por favor tenta mais tarde.";

      setError(systemErrorMessage);
    }
  };

  // useEffect
  useEffect(() => {
    return () => setCancelled(true);
  }, []);

  return {
    error,
    loading,
    //sets
    setDocument,
    setDocWithId,
    setTerritories,
    //functions - updates
    updateDocument,
    updateTerritories,
    //functions - gets
    getDocId,
    getDocWhere,
    getCollection,
    getCollectionWhere,
    getTerritories,
    getTerritoriesWhere,
    //delete
    deleteTerritory,
  };
};
