// import FileUploadPage from "./components/FileUploadPage";
// import DropDown from "./components/Dropdown";
// import './App.css';
// function App(props) {
//   return (
//     <>
//       <nav className="navbar navbar-inverse">
//         <div className="container-fluid">
//           <div className="navbar-header">
//             <a className="navbar-brand" href="#">
//               Document Analysis
//             </a>
//           </div>
//           <ul className="nav navbar-nav">
//             <li className="active">
//               <a href="#">Home</a>
//             </li>
//           </ul>
//         </div>
//       </nav>

//       <div className="container">
//         <div className="row">
//           <div className="col-md-6">
//             <div className="panel panel-default">
//               <div className="panel-heading">Upload File</div>
//               <div className="panel-body">
//                 <FileUploadPage />
//               </div>
//             </div>
//           </div>
//           <div className="col-md-6">
//             <div className="panel panel-default">
//               <div className="panel-heading">View File</div>
//               <div className="panel-body">
//                 <DropDown></DropDown>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// export default App;
import FileUploadPage from "./components/FileUploadPage";
import DropDown from "./components/Dropdown";
import "./App.css";
function App(props) {
  return (
    <>
      <nav className="navbar navbar-inverse">
        <div className="container-fluid">
          <div className="navbar-header">
            <a className="navbar-brand" href="#">
              Document Analysis
            </a>
          </div>
          <ul className="nav navbar-nav">
            <li className="active">
              <a href="#">Home</a>
            </li>
          </ul>
        </div>
      </nav>

      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <div className="panel panel-default">
              <div className="panel-heading">Upload File</div>
              <div className="panel-body">
                <FileUploadPage />
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="panel panel-default">
              <div className="panel-heading">View File</div>
              <div className="panel-body">
                <DropDown></DropDown>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
