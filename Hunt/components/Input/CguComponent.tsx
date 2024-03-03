import React, { useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  Modal,
  ScrollView,
  StyleSheet,
} from "react-native";

const CguComponent = ({ navigation }: any) => {
  const [modalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  return (
    <>
      <TouchableOpacity onPress={toggleModal}>
        <Text>
          En cliquant sur S'inscrire, vous acceptez nos{" "}
          <Text style={styles.linkText}>
            Conditions générales d'utilisation (CGU)
          </Text>
        </Text>
      </TouchableOpacity>
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <ScrollView style={styles.scrollView}>
            <Text style={styles.modalText}>
              <Text style={styles.header}>
                Politique de confidentialité et Conditions d'utilisation
              </Text>
              {"\n\n"}
              Cette politique de confidentialité et ces conditions d'utilisation
              régissent la manière dont HuntConnect collecte, utilise, maintient
              et divulgue les informations collectées auprès des utilisateurs
              chasseurs de l'application, ainsi que les conditions d'utilisation
              de l'application.{"\n\n"}
              <Text style={styles.header}>
                Collecte d'informations personnelles
              </Text>
              {"\n\n"}
              Nous pouvons collecter des informations personnelles auprès des
              utilisateurs de différentes manières, notamment lorsque les
              utilisateurs utilisent notre application, s'inscrivent sur
              l'application, passent une commande, s'abonnent à la newsletter,
              répondent à une enquête, remplissent un formulaire ou entrent en
              contact avec nous autrement. Les utilisateurs peuvent être
              invités, le cas échéant, à fournir leur nom, adresse e-mail,
              adresse postale, numéro de téléphone, informations sur la carte de
              crédit, etc. Nous collecterons des informations personnelles
              auprès des utilisateurs uniquement s'ils soumettent volontairement
              de telles informations. Les utilisateurs peuvent toujours refuser
              de fournir des informations personnelles, mais cela peut les
              empêcher de participer à certaines activités liées à
              l'application.{"\n\n"}
              <Text style={styles.header}>
                Utilisation des informations collectées
              </Text>
              {"\n\n"}
              Nous pouvons collecter et utiliser les informations personnelles
              des utilisateurs aux fins suivantes :{"\n"}- Personnaliser
              l'expérience utilisateur{"\n"}- Améliorer notre application{"\n"}-
              Améliorer le service client{"\n"}- Traiter les transactions{"\n"}-
              Envoyer des e-mails périodiques{"\n\n"}
              <Text style={styles.header}>Conditions d'utilisation</Text>
              {"\n\n"}
              En accédant et en utilisant l'application, vous acceptez d'être
              lié par les conditions d'utilisation suivantes. Si vous n'acceptez
              pas ces conditions, vous ne pouvez pas accéder à l'application ni
              l'utiliser.{"\n"}- Utilisation autorisée{"\n"}- Propriété
              intellectuelle{"\n"}- Utilisation interdite{"\n"}- Limitation de
              responsabilité{"\n"}- Modifications des conditions d'utilisation
              {"\n"}
            </Text>
          </ScrollView>
          <TouchableOpacity onPress={toggleModal}>
            <Text style={styles.closeButton}>Fermer</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  linkText: {
    textDecorationLine: "underline",
    color: "blue",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: "0%",
    marginHorizontal: "0%",
    borderRadius: 10,
    paddingHorizontal: 20,
  },
  closeButton: {
    fontSize: 18,
    color: "blue",
  },
  scrollView: {
    flex: 1,
  },
  modalText: {
    fontSize: 16,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default CguComponent;
