import { FormDivider, FormRow, FormSection, FormSwitch, FormText, FormInput } from 'enmity/components';
import { Constants, React, StyleSheet, Toasts } from 'enmity/metro/common';
import { get, set } from 'enmity/api/settings'
import { getIDByName } from 'enmity/api/assets';
import { reload } from 'enmity/api/native';

export default ({ Manifest }) => {
    const [customBnURL, setCustomBnURL] = React.useState(get(Manifest.name, 'customBunnyURL', {
        enabled: false,
        url: "http://localhost:4040/Bunny.js"
    }) as { enabled: boolean, url: string });
    const styles = StyleSheet.createThemedStyleSheet({
        icon: {
            color: Constants.ThemeColorMap.INTERACTIVE_NORMAL
        },
        info: {
            color: StyleSheet.ThemeColorMap.HEADER_PRIMARY,
            fontFamily: Constants.Fonts.DISPLAY_BOLD,
            textAlign: "center",
            fontSize: 14,
            marginTop: 10
        }
    })

    return <>
        <FormSection title="Settings">
            <FormRow
                label="Custom Bunny URL"
                subLabel="Load Bunny from a custom url"
                leading={<FormRow.Icon style={styles.icon} source={getIDByName("ic_link_24px")} />}
                trailing={<FormSwitch
                    value={customBnURL.enabled}
                    onValueChange={() => setCustomBnURL((prev: any) => {
                        set(Manifest.name, "customBnURL", { enabled: true, url: prev.url });
                        return { enabled: true, url: prev.url };
                    })}
                />}
            />
            {customBnURL.enabled && (
                <FormInput
                    value={customBnURL.url}
                    onChangeText={(txt: string) => setCustomBnURL((prev: any) => {
                        set(Manifest.name, "customBunnyURL", { enabled: prev.enabled, url: txt });
                        return { enabled: prev.enabled, url: txt };
                    })}
                    placeholder="http://localhost:4040/Bunny.js"
                    title="Bunny URL"
                />
            )}
        </FormSection>
        <FormDivider />
        <FormSection title="Clear Stores">
            <FormRow
                label="Clear Stores"
                subLabel="Clear enable dialog and cached code."
                leading={<FormRow.Icon style={styles.icon} source={getIDByName('ic_message_delete')} />}
                trailing={() => <FormRow.Arrow />}
                onPress={() => {
                    set(Manifest.name, "shownEnabledDialog", false)

                    Toasts.open({
                        content: "Successfully cleared all stored data.",
                        source: getIDByName('ic_check_18px')
                    })
                }}
            />
        </FormSection>
        <FormDivider />
        <FormSection title="Reload">
            <FormRow
                label="Reload"
                subLabel="Reload Discord to apply any changes."
                leading={<FormRow.Icon style={styles.icon} source={getIDByName('ic_message_retry')} />}
                trailing={() => <FormRow.Arrow />}
                onPress={() => reload()}
            />
        </FormSection>
        <FormDivider />
        <FormText>Version ${Manifest.version} by ${Manifest.authors.map(author => author.name).join(", ")}</FormText>
    </>
};