import React from 'react';
import { DataTable } from 'primereact/components/datatable/DataTable';
import ObjectUtils from 'primereact/components/utils/ObjectUtils';
import Spinner from 'react-svg-spinner';

/**
 * We need to extend the primereact's DataTable component in order to allow
 * custom filter on columns.
 */
export default class extends DataTable {
  exportCSV() {
    let data = this.processData();
    let csv = '\ufeff';
    let columns = React.Children.toArray(this.props.children);

    //headers
    for (let i = 0; i < columns.length; i++) {
      if (columns[i].props.field) {
        csv += '"' + (columns[i].props.header || columns[i].props.field) + '"';

        if (i < columns.length - 1) {
          csv += this.props.csvSeparator;
        }
      }
    }

    //body
    data.forEach((record, i) => {
      csv += '\n';
      for (let i = 0; i < columns.length; i++) {
        if (columns[i].props.field) {
          csv +=
            '"' +
            (columns[i].props.body
              ? columns[i].props.body(record, columns[i].props)
              : ObjectUtils.resolveFieldData(record, columns[i].props.field)) +
            '"';

          if (i < columns.length - 1) {
            csv += this.props.csvSeparator;
          }
        }
      }
    });

    let blob = new Blob([csv], {
      type: 'text/csv;charset=utf-8;',
    });

    if (window.navigator.msSaveOrOpenBlob) {
      navigator.msSaveOrOpenBlob(blob, this.exportFilename + '.csv');
    } else {
      let link = document.createElement('a');
      link.style.display = 'none';
      document.body.appendChild(link);
      if (link.download !== undefined) {
        link.setAttribute('href', URL.createObjectURL(blob));
        link.setAttribute('download', this.props.exportFilename + '.csv');
        link.click();
      } else {
        csv = 'data:text/csv;charset=utf-8,' + csv;
        window.open(encodeURI(csv));
      }
      document.body.removeChild(link);
    }
  }

  renderLoader() {
    return (
      <div className="ui-datatable-loader">
        <div className="ui-datatable-loader-overlay ui-widget-overlay" />
        <div className="ui-datatable-loader-content">
          <Spinner size="32px" color="#00AADB" />
        </div>
      </div>
    );
  }
}
