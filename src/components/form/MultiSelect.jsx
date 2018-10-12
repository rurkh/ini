import { MultiSelect } from 'primereact/components/multiselect/MultiSelect';

export default class extends MultiSelect {
  getLabel() {
    const { value } = this.props;

    return value && value.length
      ? value.map(v => this.findLabelByValue(v)).join(', ')
      : this.props.defaultLabel;
  }
}
