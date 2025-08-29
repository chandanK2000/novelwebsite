import { useParams } from "react-router-dom";
import './CaseStudyDetail.css'; // import the CSS

const CaseStudyDetail = ({ caseStudiesData }) => {
  const { id } = useParams();

  return (
    <div className="case-study-detail">
      <h1>Case Study Detail Page</h1>
      <p><strong>ID from URL:</strong> {id}</p>
    </div>
  );
};

export default CaseStudyDetail;
