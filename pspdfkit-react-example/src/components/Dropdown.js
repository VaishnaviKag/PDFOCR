import React from "react";
import PdfViewerComponent from "./PdfViewerComponent";

class DropDown extends React.Component {
  state = {
    values: [],
    value: "",
    word: "",
    instance: null,
  };

  setInstance = (ins) => {
    this.setState({
      instance: ins,
    });
  };

  handleOnChange = (event) => {
    this.setState({
      word: event.target.value,
    });
  };
  handleOnClick = (event) => {
    const formData = new FormData();
    formData.append("filepath", this.state.value);
    formData.append("word", this.state.word);

    fetch("http://127.0.0.1:5004/SearchWord", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then(async (result) => {
        console.log(result);
        console.log(this.state.instance);

        let PSPDFKit = await import("pspdfkit");

        const { List } = PSPDFKit.Immutable;
        const { DrawingPoint, Rect } = PSPDFKit.Geometry;
        const { InkAnnotation } = PSPDFKit.Annotations;

        const pagesAnnotations = await Promise.all(
          Array.from({ length: this.state.instance.totalPageCount }).map(
            (_, pageIndex) => this.state.instance.getAnnotations(pageIndex)
          )
        );
        const annotationIds = pagesAnnotations.flatMap((pageAnnotations) =>
          pageAnnotations.map((annotation) => annotation.id).toArray()
        );
        await this.state.instance.delete(annotationIds);

        for (var i = 0; i < result.data.length; i++) {
          var bbox = result.data[i].Box.split(" ");

          const annotation = new PSPDFKit.Annotations.RectangleAnnotation({
            pageIndex: result.data[i].PageNo - 1,
            strokeWidth: 1,
            boundingBox: new PSPDFKit.Geometry.Rect({
              left: parseInt(bbox[0]) * 0.35,
              top: parseInt(bbox[2]) * 0.35,
              width: (parseInt(bbox[1]) - parseInt(bbox[0]) + 20) * 0.38,
              height: (parseInt(bbox[3]) - parseInt(bbox[2]) + 20) * 0.38,
            }),
          });
          const [createdAnnotation] = await this.state.instance.create(
            annotation
          );
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  // const [text, setText]; = useState('');

  componentDidMount() {
    fetch("http://127.0.0.1:5004/GetAllFiles", {
      method: "GET",
    })
      .then((response) => response.json())
      .then((result) => {
        this.setState({
          values: result.data,
        });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  onChangeddl = (event) => {
    this.setState({
      value: event.target.value,
    });
  };

  render() {
    return (
      <>
        <div className="drop-down">
          {/*<select onChange={this.onChangeddl}>*/}
          <select onChange={this.onChangeddl} className="dropdown">
            <option value="">Select File to View</option>;
            {this.state.values.map((obj, index) => {
              return (
                <option key={`d+${index}`} value={obj.Path}>
                  {obj.Name}
                </option>
              );
            })}
          </select>
          <input
            value={this.state.word}
            onChange={this.handleOnChange}
            type="text"
            id="search"
            name="search"
          />
          <button
            className="btn btn-primary btn-sm"
            onClick={this.handleOnClick}
          >
            Search
          </button>
        </div>

        <PdfViewerComponent
          document={this.state.value}
          setInstance={this.setInstance}
        />
      </>
    );
  }
}

export default DropDown;
