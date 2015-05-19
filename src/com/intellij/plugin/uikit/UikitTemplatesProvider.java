package com.intellij.plugin.uikit;

/**
* @author Matthijs Alles
*/

import com.intellij.codeInsight.template.impl.DefaultLiveTemplatesProvider;
import org.jetbrains.annotations.Nullable;

public class UikitTemplatesProvider implements DefaultLiveTemplatesProvider {
    @Override
    public String[] getDefaultLiveTemplateFiles() {
        return new String[]{
            "liveTemplates/Uikit",
            "liveTemplates/Uikit-custom",
            "liveTemplates/Uikit-icons",
        };
    }

    @Nullable
    @Override
    public String[] getHiddenLiveTemplateFiles() {
       return null;
    }
}