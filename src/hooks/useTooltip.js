import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import '../css/Tooltip.css'

const useTooltip = (props) => {
  return (
    <OverlayTrigger
      placement="top"
      overlay={
        <Tooltip id="tooltip-top">
          {props.text}
        </Tooltip>
      }
    >
      <FontAwesomeIcon icon={faCircleQuestion} size="sm" color="#aaaaaa"/>
    </OverlayTrigger>
  )};

export default useTooltip;

