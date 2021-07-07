import React from "react";
import * as myProperties from "properties";
import axios from "axios";

const apiConfigPath = `${window.location.origin}/configuration.json`;

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.state = {
      urlApi: "",
      dataFile: null,
      modelFile: null,
      metadataFile: null,
      treatmentFile: null,
      displayErrorData: false,
      displayErrorModel: false,

      dataFileType: myProperties.parameters.DataFileType[this.props.type],
      modelFileType: myProperties.parameters.ModelFileType[this.props.type],
      dataFileTypeName:
        myProperties.parameters.DataFileTypeName[this.props.type],
      modelFileTypeName:
        myProperties.parameters.ModelFileTypeName[this.props.type],
      surveyName: "",
    };
  }

  componentDidMount() {
    fetch(apiConfigPath)
      .then((response) => response.json())
      .then((data) => this.setState({ urlApi: data.urlApi }));
  }

  extractExtension = (f) =>
    f.name.split(".")[f.name.split(".").length - 1].trim();

  onClick(event) {
    const { urlApi } = this.state;
    event.preventDefault();
    const myFiles = new FormData();
    myFiles.append("survey", this.state.surveyName);
    myFiles.append("data", this.state.dataFile);
    myFiles.append("model", this.state.modelFile);

    if(this.props.type === "cawiv2" )
      { myFiles.append("metadata", this.state.metadataFile)}
  

    const config = {
      headers: { "Content-Type": "multipart/form-data" },
    };
    axios({
      method: "post",
      url: urlApi + myProperties.parameters.VizualisationPath[this.props.type],

      data: myFiles,
      responseType: this.props.type === "papi" ? "blob" : null,
      config,
    })
      .then((response) => {
        this.props.type !== "papi"
          ? this.handleClickCawiCati(response)
          : this.handleClickPapi(response);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  onDownload(event) {
    const { urlApi } = this.state;
    event.preventDefault();
    const myFilesDl = new FormData();
    myFilesDl.append("survey", this.state.surveyName);
    myFilesDl.append("model", this.state.modelFile);

    const config = { headers: { "Content-Type": "multipart/form-data" } };
    axios({
      method: "post",
      url: urlApi + myProperties.parameters.VizualisationPath[this.props.type],

      data: myFilesDl,
      responseType: "blob",
      config,
    })
      .then((response) => {
        this.handleClickPersoFile(response);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleClickPapi(response) {
    const file = new Blob([response.data], { type: "application/pdf" });
    const fileURL = window.URL.createObjectURL(file);
    let a = document.createElement("a");
    a.href = fileURL;
    a.download = `[${this.state.surveyName}]Prévisualisation Questionnaire.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
  handleClickPersoFile(response) {
    const file = new Blob([response.data], { type: "application/xml" });
    const fileURL = window.URL.createObjectURL(file);
    let a = document.createElement("a");
    a.href = fileURL;
    a.download = `[${this.state.surveyName}]Fichier de personnalisation.xml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  handleClickCawiCati(response) {
    window.open(response.data);
  }

  handleFile(e, FileType) {
    const File = e.target.files[0];

    let displayErrorType;
    switch (FileType) {
      case "data":
        displayErrorType = !(
          this.state.dataFileType === this.extractExtension(File)
        );

        break;
      case "model":
        displayErrorType = !(
          this.state.modelFileType === this.extractExtension(File)
        );

        break;

      default:
    }
    this.setState({
      [FileType + "File"]: File,
      ["displayError" + FileType]: displayErrorType,
    });
  }
  onChange(event) {
    this.setState({ surveyName: event.target.value });
  }

  render() {
    const {
      dataFile,
      modelFile,
      displayErrorData,
      displayErrorModel,
      dataFileType,
      modelFileType,
      dataFileTypeName,
      modelFileTypeName,
      surveyName,
    } = this.state;
    return (
      <React.Fragment>
        <div id="box">
          <form id="filesend">
            <label>
              Saisir l'acronyme de l'enquête :
              <input
                type="text"
                id="SurveyName"
                placeholder="Ex:EEC19,..."
                value={this.state.surveyName}
                onChange={this.onChange}
                required
              />
            </label>

            {surveyName === "" && (dataFile !== null || modelFile != null) ? (
              <div className="errorText">
                Merci de renseigner un nom d'enquête pour débloquer l'accés aux
                différentes options
              </div>
            ) : null}
            <br />
            <br />
            <label>
              Charger un modèle de données (au format {modelFileTypeName})
              <input
                type="file"
                id="ModelFile"
                accept={`${modelFileType}`}
                onChange={(e) => this.handleFile(e, "model")}
                required
              />
            </label>
            {modelFile !== null && displayErrorModel === true ? (
              <div className="errorText">
                Le fichier de modèle sélectionné est au format{" "}
                <b>
                  <u>{this.extractExtension(modelFile)}</u>
                </b>{" "}
                mais le format{" "}
                <b>
                  <u>{modelFileTypeName}</u>
                </b>{" "}
                est attendu.
              </div>
            ) : null}
            <br />
            <br />
            {this.props.type === "cawiv2" ? (
              <label>
                (Optionnel) Charger un fichier de métadonnées (au format json)
                <input
                  type="file"
                  id="MetadataFile"
                  accept="application/JSON"
                  onChange={(e) => this.handleFile(e, "metadata")}
                />
              </label>
            ) : null}

            <br />
            <br />
            <label>
              Charger un fichier de données (au format {dataFileTypeName})
            </label>
            <br></br>
            <ul className="DataUploadChoice">
              <li>
                {" "}
                En téléchargeant un fichier de personnalisation
                <button
                  type="submit"
                  id="DownloadPerso"
                  disabled={
                    !(
                      !displayErrorModel &&
                      modelFile !== null &&
                      surveyName !== ""
                    )
                  }
                  onClick={(e) => this.onDownload(e)}
                >
                  Télécharger un fichier de personnalisation
                </button>
              </li>
              <li>
                Directement depuis votre disque local
                <input
                  type="file"
                  id="DataFile"
                  accept={`${dataFileType}`}
                  onChange={(e) => this.handleFile(e, "data")}
                  required
                />
              </li>
            </ul>

            {dataFile !== null && displayErrorData === true ? (
              <div className="errorText">
                Le fichier de données sélectionné est au format{" "}
                <b>
                  <u>{this.extractExtension(dataFile)} </u>
                </b>{" "}
                mais le format{" "}
                <b>
                  <u> {dataFileTypeName}</u>
                </b>{" "}
                est attendu
              </div>
            ) : null}
            <br />
            <br />

            <button
              type="submit"
              id="VisualizeSurvey"
              onClick={(e) => this.onClick(e)}
              disabled={
                !(
                  !displayErrorData &&
                  !displayErrorModel &&
                  dataFile !== null &&
                  modelFile !== null &&
                  surveyName !== ""
                )
              }
            >
              {this.props.type === "papi"
                ? "Générer le Pdf de publipostage"
                : "Prévisualiser le questionnaire"}
            </button>
          </form>
        </div>
      </React.Fragment>
    );
  }
}

export default Form;
