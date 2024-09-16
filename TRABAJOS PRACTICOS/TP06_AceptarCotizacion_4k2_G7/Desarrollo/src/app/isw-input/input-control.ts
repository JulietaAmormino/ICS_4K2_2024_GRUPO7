export class InputControl {
    label: string = '';
    value: string = '';
    id: string = '';
    type: 'text' | 'password' | 'number' | 'email' | 'textarea' = 'text';
    show: boolean = true;
    prefixType?: 'icon' | 'text';
    prefix?: string;
    suffixType?: 'icon' | 'text';
    suffix?: string;
    placeholder?: string = '';
    disabled?: boolean = false;
    showlabel?: boolean = true;
    mask?: string;
}