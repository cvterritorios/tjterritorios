import { db } from "../services/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
} from "firebase/firestore";

// hooks
import { useState, useEffect } from "react";

export const useFirestore = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);

  //cleanup
  const [cancelled, setCancelled] = useState(false);

  function checkIfCancelled() {
    if (cancelled) return;
  }

  async function getDoscsQuery(q) {
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

  // functions - update
  const updateDocument = async (collect, docu, data) => {
    validate("start");
    let systemErrorMessage;

    try {
      const res = await updateDoc(doc(db, collect, docu), data);
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

  // functions - gets
  const getDocId = async (collect, documentId) => {
    validate("start");
    let systemErrorMessage;
    try {
      const docRef = doc(db, collect, documentId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        validate("end");
        return docSnap.data();
      } else {
        systemErrorMessage = "Documento não encontrado.";

        setError(systemErrorMessage);
      }
    } catch (error) {
      console.log(error.messeger);
      console.log(typeof error.messeger);

      systemErrorMessage = "Ocorreu um erro, por favor tenta mais tarde.";

      setError(systemErrorMessage);
    }
    validate("end");
  };

  const getDocWhere = async (
    collect,
    whr = { attr: "", comp: "", value: "" },
    id = false
  ) => {
    //where {attr, comp, value}
    validate("start");

    try {
      const q = query(
        collection(db, collect),
        where(whr.attr, whr.comp, whr.value)
      );

      const res = await getDoscsQuery(q);

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

  const getCollection = async (collect) => {
    validate("start");

    try {
      const q = query(collection(db, collect));

      const res = await getDoscsQuery(q);

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

  const getCollectionWhere = async (
    collect,
    whr = { attr: "", comp: "", value: "" }
  ) => {
    //where {attr, comp, value}
    validate("start");

    try {
      const q = query(
        collection(db, collect),
        where(whr.attr, whr.comp, whr.value)
      );

      const res = await getDoscsQuery(q);

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

  // functions - gets

  // useEffect
  useEffect(() => {
    return () => setCancelled(true);
  }, []);

  return {
    error,
    loading,
    //sets
    setDocument,
    //functions - updates
    updateDocument,
    //functions - gets
    getDocId,
    getDocWhere,
    getCollection,
    getCollectionWhere,
  };
};
